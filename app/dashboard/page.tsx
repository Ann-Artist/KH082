'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, CarbonResult, Quest, UserQuestState, ProofSubmission } from '@/types';
import { HeroCanopyCard } from '../../components/dashboard/HeroCanopyCard';
import { QuestCard } from '../../components/quests/QuestCard';
import { GlassCard } from '../../components/ui/GlassCard';
import { VerificationModal } from '../../components/quests/VerificationModal';
import { LevelUpModal } from '../../components/gamification/LevelUpModal';
import { awardQuestCompletion } from '../../lib/gamification/xp';
import {
  getStoredUserProfile,
  getStoredCarbonResult,
  getAllQuests,
  getStoredQuestStates,
  getStoredProofSubmissions,
  saveUserProfile,
  saveQuestStates,
  saveProofSubmissions,
} from '../../lib/storage';
import { analyzeHotspots } from '../../lib/ai/hotspot';
import { getAlternativeQuestRecommendation } from '../../lib/ai/advisor';

export default function DashboardPage(props: any) {
  const initialUser: UserProfile | undefined = props?.user;
  const initialCarbonResult: CarbonResult | undefined = props?.carbonResult;
  const initialAllQuests: Quest[] | undefined = props?.allQuests;
  const initialQuestStates: Record<string, UserQuestState> | undefined = props?.questStates;
  const initialProofSubmissions: ProofSubmission[] | undefined = props?.proofSubmissions;
  const onUpdateState = props?.onUpdateState;
  const onNavigate = props?.onNavigate;
  const router = useRouter();

  const [userState, setUserState] = useState<UserProfile>(() => initialUser || getStoredUserProfile());
  const [questStatesState, setQuestStatesState] = useState<Record<string, UserQuestState>>(() => initialQuestStates || getStoredQuestStates((initialUser || getStoredUserProfile()).id));
  const [proofsState, setProofsState] = useState<ProofSubmission[]>(() => initialProofSubmissions || getStoredProofSubmissions((initialUser || getStoredUserProfile()).id));

  const user = initialUser || userState;
  const carbonResult = initialCarbonResult || getStoredCarbonResult();
  const allQuests = initialAllQuests || getAllQuests();
  const questStates = initialQuestStates || questStatesState;
  const proofSubmissions = initialProofSubmissions || proofsState;

  const handleNav = (path: string) => {
    if (typeof onNavigate === 'function') {
      onNavigate(path);
    } else {
      router.push(path);
    }
  };

  const handleStateUpdate = (newProfile: UserProfile, newQuestStates: Record<string, UserQuestState>, newProofs: ProofSubmission[]) => {
    setUserState(newProfile);
    setQuestStatesState(newQuestStates);
    setProofsState(newProofs);
    if (typeof onUpdateState === 'function') {
      onUpdateState(newProfile, newQuestStates, newProofs);
    }
  };

  const [selectedQuestForProof, setSelectedQuestForProof] = useState<Quest | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ isOpen: boolean; newLevel: number; title: any; xp: number }>({
    isOpen: false,
    newLevel: user.level,
    title: user.persona,
    xp: 0,
  });

  const [aiSwapModal, setAiSwapModal] = useState<{ isOpen: boolean; quest: Quest | null; rec: any }>({
    isOpen: false,
    quest: null,
    rec: null,
  });

  const hotspots = analyzeHotspots(carbonResult);

  // Filter quests relevant to user's primary emission hotspot
  const hotspotQuests = allQuests.filter((q) => q.category === carbonResult.hotspotCategory);
  const otherQuests = allQuests.filter((q) => q.category !== carbonResult.hotspotCategory);
  const displayQuests = [...hotspotQuests, ...otherQuests].slice(0, 4);

  const handleAcceptQuest = (questId: string) => {
    const updatedStates = {
      ...questStates,
      [questId]: { questId, status: 'active' as const, acceptedAt: new Date().toISOString() },
    };
    saveQuestStates(updatedStates);
    handleStateUpdate(user, updatedStates, proofSubmissions);
  };

  const handleCantDo = (quest: Quest) => {
    const rec = getAlternativeQuestRecommendation(quest);
    setAiSwapModal({ isOpen: true, quest, rec });
  };

  const handleProofVerifiedSuccess = (quest: Quest, submission: ProofSubmission) => {
    setSelectedQuestForProof(null);

    // 1. Award XP and check level progression
    const awardResult = awardQuestCompletion(user, quest.xpReward, quest.co2ImpactKg);
    saveUserProfile(awardResult.updatedProfile);

    // 2. Mark Quest completed
    const updatedStates = {
      ...questStates,
      [quest.id]: {
        questId: quest.id,
        status: 'completed' as const,
        completedAt: new Date().toISOString(),
        proofId: submission.id,
      },
    };
    saveQuestStates(updatedStates);

    // 3. Save proof submission
    const updatedProofs = [submission, ...proofSubmissions];
    saveProofSubmissions(updatedProofs);

    handleStateUpdate(awardResult.updatedProfile, updatedStates, updatedProofs);

    // 4. If leveled up, trigger celebration modal
    if (awardResult.leveledUp) {
      setLevelUpData({
        isOpen: true,
        newLevel: awardResult.newLevel,
        title: awardResult.updatedProfile.persona,
        xp: quest.xpReward,
      });
    }
  };

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Hero Canopy Card */}
      <HeroCanopyCard
        user={user}
        carbonResult={carbonResult}
        onNavigateQuests={() => handleNav('/quests')}
      />

      {/* AI Hotspot Analysis Banner */}
      <GlassCard glow className="border-l-4 border-l-[#6bfb9a]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6bfb9a]/20 text-[#6bfb9a]">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-title-md text-base font-bold text-white">AI Hotspot Rationale</h3>
              <p className="mt-1 text-xs text-[#bccabb]">{hotspots.prioritySummary}</p>
            </div>
          </div>

          <button
            onClick={() => handleNav('/impact')}
            className="shrink-0 rounded-xl border border-[#6bfb9a]/30 bg-[#6bfb9a]/10 px-4 py-2 font-mono text-xs font-bold text-[#6bfb9a] hover:bg-[#6bfb9a]/20"
          >
            Full Impact Breakdown →
          </button>
        </div>
      </GlassCard>

      {/* Recommended Quests Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-xl font-bold text-white">Recommended & Active Quests</h2>
            <p className="text-xs text-[#bccabb]">Personalized for your {user.persona} rank in {user.puneWard}</p>
          </div>

          <button
            onClick={() => handleNav('/quests')}
            className="text-xs font-mono font-bold text-[#6bfb9a] hover:underline"
          >
            View All Quests ({allQuests.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayQuests.map((quest) => {
            const st = questStates[quest.id]?.status || 'available';
            return (
              <QuestCard
                key={quest.id}
                quest={quest}
                status={st}
                onAccept={handleAcceptQuest}
                onComplete={(q) => setSelectedQuestForProof(q)}
                onCantDo={handleCantDo}
              />
            );
          })}
        </div>
      </div>

      {/* Quick Category Footprint Breakdown */}
      <div>
        <h2 className="mb-4 font-headline-lg text-xl font-bold text-white">Carbon Category Breakdown</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {carbonResult.breakdown.map((cat) => (
            <GlassCard key={cat.category} className="text-center p-4">
              <span className="material-symbols-outlined text-2xl text-[#6bfb9a]">{cat.icon}</span>
              <div className="mt-1 font-mono text-lg font-bold text-white">{cat.amountKg} kg</div>
              <div className="text-xs text-[#bccabb]">{cat.name}</div>
              <span
                className={`mt-2 inline-block rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                  cat.priority === 'HIGH'
                    ? 'border border-red-500/30 bg-red-500/10 text-red-400'
                    : cat.priority === 'MEDIUM'
                    ? 'border border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                    : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                }`}
              >
                {cat.priority} PRIORITY
              </span>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Modals */}
      <VerificationModal
        quest={selectedQuestForProof}
        isOpen={!!selectedQuestForProof}
        userId={user.id}
        userName={user.name}
        previousSubmissions={proofSubmissions}
        onClose={() => setSelectedQuestForProof(null)}
        onVerifiedSuccess={handleProofVerifiedSuccess}
      />

      <LevelUpModal
        isOpen={levelUpData.isOpen}
        newLevel={levelUpData.newLevel}
        levelTitle={levelUpData.title}
        xpEarned={levelUpData.xp}
        onClose={() => setLevelUpData({ ...levelUpData, isOpen: false })}
      />

      {/* AI Swap Modal */}
      {aiSwapModal.isOpen && aiSwapModal.rec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#6bfb9a]/30 bg-[#121b16] p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-[#6bfb9a]">
              <span className="material-symbols-outlined text-2xl">swap_horiz</span>
              <h3 className="font-headline-lg text-lg font-bold text-white">AI Alternative Recommended</h3>
            </div>
            <p className="mt-3 text-xs font-semibold text-white">{aiSwapModal.rec.alternativeTitle}</p>
            <p className="mt-1 text-xs text-[#bccabb]">{aiSwapModal.rec.alternativeDescription}</p>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] font-mono text-[#6bfb9a]">
              💡 {aiSwapModal.rec.reason}
            </div>
            <button
              onClick={() => setAiSwapModal({ isOpen: false, quest: null, rec: null })}
              className="mt-5 w-full rounded-xl bg-[#6bfb9a] py-2.5 text-xs font-bold text-[#003919]"
            >
              Got It - Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
