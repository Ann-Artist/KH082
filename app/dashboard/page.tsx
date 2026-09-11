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
    <div className="space-y-6 pb-20 md:pb-8 font-sans">
      {/* Hero Canopy Summary Header */}
      <HeroCanopyCard
        user={user}
        carbonResult={carbonResult}
        onNavigateQuests={() => handleNav('/quests')}
      />

      {/* Row 1: Top 3 Metric Cards matching reference UI */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Card 1: Featured Dark Card (Air Pollution Level) */}
        <div className="flex flex-col justify-between rounded-2xl bg-[#0c1410] p-5 border border-white/5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Air Pollution Level</span>
            <div className="flex items-end gap-1 h-6">
              <div className="w-1 bg-[#10b981]/40 h-3 rounded-full"></div>
              <div className="w-1 bg-[#10b981]/70 h-5 rounded-full"></div>
              <div className="w-1 bg-[#10b981] h-4 rounded-full"></div>
              <div className="w-1 bg-[#10b981] h-6 rounded-full"></div>
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-black tracking-tight text-white">35.05 <span className="text-sm font-normal text-gray-400">µg/m³</span></h3>
            <p className="text-[11px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
              <span>↗ 2.3%</span> <span className="text-gray-400 font-normal">than last month</span>
            </p>
          </div>
        </div>

        {/* Card 2: Light Metric Card (Environmental Quality Index) */}
        <div className="flex flex-col justify-between rounded-2xl bg-white p-5 border border-[#e2e8e3] text-gray-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Environmental Quality Index</span>
            <div className="flex items-end gap-1 h-6">
              <div className="w-1 bg-rose-400 h-4 rounded-full"></div>
              <div className="w-1 bg-rose-500 h-6 rounded-full"></div>
              <div className="w-1 bg-rose-400 h-3 rounded-full"></div>
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-black tracking-tight text-gray-900">75.50<span className="text-sm font-normal text-gray-400">/100%</span></h3>
            <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
              <span>↘ 1.4%</span> <span className="text-gray-400 font-normal">than last month</span>
            </p>
          </div>
        </div>

        {/* Card 3: Light Metric Card (Investments in Clean Tech) */}
        <div className="flex flex-col justify-between rounded-2xl bg-white p-5 border border-[#e2e8e3] text-gray-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Investments in Clean Technologies</span>
            <div className="flex items-end gap-1 h-6">
              <div className="w-1 bg-[#10b981]/40 h-3 rounded-full"></div>
              <div className="w-1 bg-[#10b981]/70 h-5 rounded-full"></div>
              <div className="w-1 bg-[#10b981] h-6 rounded-full"></div>
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-black tracking-tight text-gray-900">$967,570</h3>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <span>↗ 5.1</span> <span className="text-gray-400 font-normal">than last month</span>
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Climate Index Chart + Pale Mint Highlight Card */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Climate Change Index Bar Chart (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-[#e2e8e3] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Climate Change Index</h3>
              <p className="text-xs text-gray-500">Weekly Pune Eco Tracking Progress</p>
            </div>
            <button className="flex items-center gap-1 rounded-full bg-[#111827] px-3.5 py-1 text-xs font-semibold text-white">
              <span>2 month</span>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </button>
          </div>

          {/* Bar Chart Visualization */}
          <div className="relative h-44 w-full flex items-end justify-between pt-6 border-b border-gray-100">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-gray-300">
              <div className="border-b border-dashed border-gray-200">100</div>
              <div className="border-b border-dashed border-gray-200">60</div>
              <div className="border-b border-dashed border-gray-200">20</div>
              <div>0</div>
            </div>

            {/* Bars */}
            {[
              { label: 'W1', height: 'h-24', active: false },
              { label: 'W2', height: 'h-36', active: false },
              { label: 'W3', height: 'h-20', active: false },
              { label: 'W4', height: 'h-36', active: true, value: '82.6 CCI' },
              { label: 'W5', height: 'h-28', active: false },
              { label: 'W6', height: 'h-32', active: false },
              { label: 'W7', height: 'h-20', active: false },
              { label: 'W8', height: 'h-24', active: false },
            ].map((bar, idx) => (
              <div key={idx} className="relative flex flex-col items-center flex-1 z-10">
                {bar.active && (
                  <div className="absolute -top-7 rounded bg-[#111827] px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    {bar.value}
                  </div>
                )}
                <div
                  className={`w-3 md:w-5 rounded-t transition-all ${
                    bar.active ? 'bg-[#10b981]' : 'bg-[#10b981]/50 hover:bg-[#10b981]/80'
                  } ${bar.height}`}
                ></div>
                <span className="mt-2 text-[10px] font-semibold text-gray-400">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pale Mint Card (CO2 Reduction & Recycling Metrics) */}
        <div className="rounded-2xl bg-[#dbebd8] p-6 border border-[#c7e0c4] text-[#0f2416] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-4xl font-black tracking-tight text-[#0f2416]">
              99,681m <span className="text-sm font-semibold uppercase text-[#1b4329]">TONS</span>
            </h3>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100/80 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
              <span>↗ 20% reduced CO2</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-white/60 p-3 border border-white/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                <span className="material-symbols-outlined text-sm">sync</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Mechanical recycling</h4>
                <p className="text-[11px] font-semibold text-gray-500">1,697 TONS</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/60 p-3 border border-white/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
                <span className="material-symbols-outlined text-sm">bubble_chart</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Chemical recycling</h4>
                <p className="text-[11px] font-semibold text-gray-500">913 TONS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Regional Table + Dark Map Card */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Table Card (Plastic Recycling by Region) */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 border border-[#e2e8e3] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">Plastic Recycling by Region</h3>
            <button className="flex items-center gap-1 rounded-full bg-[#111827] px-3 py-1 text-xs font-semibold text-white">
              <span>All regions</span>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] font-bold">
                  <th className="pb-3">Region</th>
                  <th className="pb-3">Factory</th>
                  <th className="pb-3">Recycled</th>
                  <th className="pb-3">Dynamic</th>
                  <th className="pb-3">Main Technologies</th>
                  <th className="pb-3 text-right">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-semibold">
                {[
                  { region: 'USA (America)', flag: '🇺🇸', factory: '253+', recycled: '35%', tech: 'Mechanical', tagBg: 'bg-amber-100 text-amber-800', value: '4,167,987 tons' },
                  { region: 'German (Europe)', flag: '🇩🇪', factory: '211+', recycled: '60%', tech: 'Mechanical', tagBg: 'bg-amber-100 text-amber-800', value: '2,571,193 tons' },
                  { region: 'Japan (Asia)', flag: '🇯🇵', factory: '364+', recycled: '85%', tech: 'Energy recovery', tagBg: 'bg-sky-100 text-sky-800', value: '1,864,275 tons' },
                  { region: 'China (Asia)', flag: '🇨🇳', factory: '855+', recycled: '25%', tech: 'Chemical', tagBg: 'bg-emerald-100 text-emerald-800', value: '8,643,742 tons' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 flex items-center gap-2">
                      <span className="text-base">{row.flag}</span>
                      <span className="font-bold text-gray-900">{row.region}</span>
                    </td>
                    <td className="py-3 text-gray-600">{row.factory}</td>
                    <td className="py-3 text-gray-900">{row.recycled}</td>
                    <td className="py-3">
                      <div className="w-12 h-3 flex items-center gap-0.5">
                        <div className="w-2 h-1 bg-emerald-400 rounded-full"></div>
                        <div className="w-2 h-2.5 bg-emerald-500 rounded-full"></div>
                        <div className="w-2 h-1.5 bg-emerald-400 rounded-full"></div>
                        <div className="w-2 h-3 bg-emerald-600 rounded-full"></div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${row.tagBg}`}>
                        {row.tech}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-gray-900">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dark Map Card (Global Pollution) */}
        <div className="rounded-2xl bg-[#0c1410] p-5 border border-white/5 text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <h3 className="text-base font-bold text-white">Global pollution</h3>
            <button className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              <span>Europe</span>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </button>
          </div>

          {/* Map Graphic Simulation */}
          <div className="my-6 relative h-40 w-full rounded-xl bg-[#09100c] border border-white/5 flex items-center justify-center p-4">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px]"></div>

            {/* Glowing Map Tooltip */}
            <div className="relative z-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2 text-center shadow-lg">
              <h5 className="text-xs font-bold text-white">Ukraine</h5>
              <p className="text-[10px] text-gray-300">High Level</p>
              <div className="mt-1 flex items-center justify-center gap-1 text-xs font-bold text-emerald-400">
                <span>89%</span>
                <span>→</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 z-10">
            <span className="material-symbols-outlined text-base">help_outline</span>
            <span className="text-[10px]">Updated 5 mins ago</span>
          </div>
        </div>
      </div>

      {/* Recommended Quests Section */}
      <div className="mt-8 rounded-2xl bg-white p-6 border border-[#e2e8e3] shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Recommended & Active Quests</h2>
            <p className="text-xs text-gray-500">Personalized for your {user.persona} rank in {user.puneWard}</p>
          </div>

          <button
            onClick={() => handleNav('/quests')}
            className="text-xs font-bold text-[#10b981] hover:underline"
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
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-[#10b981]">
              <span className="material-symbols-outlined text-2xl">swap_horiz</span>
              <h3 className="text-lg font-bold text-gray-900">AI Alternative Recommended</h3>
            </div>
            <p className="mt-3 text-xs font-semibold text-gray-800">{aiSwapModal.rec.alternativeTitle}</p>
            <p className="mt-1 text-xs text-gray-500">{aiSwapModal.rec.alternativeDescription}</p>
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
