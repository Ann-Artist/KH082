'use client';

import React, { useState } from 'react';
import { UserProfile, Quest, UserQuestState, ProofSubmission } from '@/types';
import { QuestCard } from '../../components/quests/QuestCard';
import { VerificationModal } from '../../components/quests/VerificationModal';
import { LevelUpModal } from '../../components/gamification/LevelUpModal';
import { awardQuestCompletion } from '../../lib/gamification/xp';
import {
  getStoredUserProfile,
  getAllQuests,
  getStoredQuestStates,
  getStoredProofSubmissions,
  saveUserProfile,
  saveQuestStates,
  saveProofSubmissions,
} from '../../lib/storage';
import { getAlternativeQuestRecommendation } from '../../lib/ai/advisor';

interface QuestsPageProps {
  user?: UserProfile;
  allQuests?: Quest[];
  questStates?: Record<string, UserQuestState>;
  proofSubmissions?: ProofSubmission[];
  onUpdateState?: (user: UserProfile, questStates: Record<string, UserQuestState>, proofs: ProofSubmission[]) => void;
}

export default function QuestsPage(props: any) {
  const initialUser: UserProfile | undefined = props?.user;
  const initialAllQuests: Quest[] | undefined = props?.allQuests;
  const initialQuestStates: Record<string, UserQuestState> | undefined = props?.questStates;
  const initialProofSubmissions: ProofSubmission[] | undefined = props?.proofSubmissions;
  const onUpdateState = props?.onUpdateState;
  const [userState, setUserState] = useState<UserProfile>(() => initialUser || getStoredUserProfile());
  const [questStatesState, setQuestStatesState] = useState<Record<string, UserQuestState>>(() => initialQuestStates || getStoredQuestStates((initialUser || getStoredUserProfile()).id));
  const [proofsState, setProofsState] = useState<ProofSubmission[]>(() => initialProofSubmissions || getStoredProofSubmissions((initialUser || getStoredUserProfile()).id));

  const user = initialUser || userState;
  const allQuests = initialAllQuests || getAllQuests();
  const questStates = initialQuestStates || questStatesState;
  const proofSubmissions = initialProofSubmissions || proofsState;

  const handleStateUpdate = (newProfile: UserProfile, newQuestStates: Record<string, UserQuestState>, newProofs: ProofSubmission[]) => {
    setUserState(newProfile);
    setQuestStatesState(newQuestStates);
    setProofsState(newProofs);
    if (typeof onUpdateState === 'function') {
      onUpdateState(newProfile, newQuestStates, newProofs);
    }
  };
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDuration, setFilterDuration] = useState<string>('all');
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

  const filteredQuests = allQuests.filter((q) => {
    if (filterCategory !== 'all' && q.category !== filterCategory) return false;
    if (filterDuration !== 'all' && q.duration !== filterDuration) return false;
    return true;
  });

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

    const awardResult = awardQuestCompletion(user, quest.xpReward, quest.co2ImpactKg);
    saveUserProfile(awardResult.updatedProfile);

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

    const updatedProofs = [submission, ...proofSubmissions];
    saveProofSubmissions(updatedProofs);

    handleStateUpdate(awardResult.updatedProfile, updatedStates, updatedProofs);

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
    <div className="space-y-6 pb-20 md:pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Sustainability Quests Hub</h1>
          <p className="text-xs text-gray-600">Turn real-world Pune actions into EcoXP, badges & streaks.</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-900 shadow-sm focus:border-[#10b981] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="transportation">Transportation</option>
            <option value="electricity">Electricity</option>
            <option value="food">Food & Diet</option>
            <option value="shopping">Shopping</option>
            <option value="waste">Waste Management</option>
          </select>

          <select
            value={filterDuration}
            onChange={(e) => setFilterDuration(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-900 shadow-sm focus:border-[#10b981] focus:outline-none"
          >
            <option value="all">All Durations</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Special">Special / Milestone</option>
          </select>
        </div>
      </div>

      {/* Quests Catalog Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredQuests.map((quest) => {
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

      {aiSwapModal.isOpen && aiSwapModal.rec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl text-gray-900">
            <div className="flex items-center gap-2 text-[#10b981]">
              <span className="material-symbols-outlined text-2xl">swap_horiz</span>
              <h3 className="text-lg font-bold text-gray-900">AI Alternative Recommended</h3>
            </div>
            <p className="mt-3 text-xs font-semibold text-gray-800">{aiSwapModal.rec.alternativeTitle}</p>
            <p className="mt-1 text-xs text-gray-600">{aiSwapModal.rec.alternativeDescription}</p>
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 text-[11px] font-mono text-emerald-800">
              💡 {aiSwapModal.rec.reason}
            </div>
            <button
              onClick={() => setAiSwapModal({ isOpen: false, quest: null, rec: null })}
              className="mt-5 w-full rounded-xl bg-[#111827] py-2.5 text-xs font-bold text-white hover:bg-black"
            >
              Got It - Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
