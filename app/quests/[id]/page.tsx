'use client';

import React, { useState } from 'react';
import { Quest, UserQuestState, ProofSubmission, UserProfile } from '@/types';
import { GlassCard } from '../../../components/ui/GlassCard';
import { VerificationModal } from '../../../components/quests/VerificationModal';
import { awardQuestCompletion } from '../../../lib/gamification/xp';
import { saveUserProfile, saveQuestStates, saveProofSubmissions } from '../../../lib/storage';

interface QuestDetailPageProps {
  questId: string;
  allQuests: Quest[];
  user: UserProfile;
  questStates: Record<string, UserQuestState>;
  proofSubmissions: ProofSubmission[];
  onNavigate: (path: string) => void;
  onUpdateState: (user: UserProfile, questStates: any, proofs: ProofSubmission[]) => void;
}

export default function QuestDetailPage(props: any) {
  const questId = props?.questId || props?.params?.id || '';
  const allQuests: Quest[] = props?.allQuests || [];
  const user: UserProfile = props?.user || { id: 'u1', name: 'Citizen', username: 'citizen', level: 1, ecoXP: 0, persona: 'Carbon Challenger', streakDays: 1, completedQuestsCount: 0, totalCO2AvoidedKg: 0, puneWard: 'Kothrud', ageGroup: 'Gen Z / Young Adult' };
  const questStates = props?.questStates || {};
  const proofSubmissions: ProofSubmission[] = props?.proofSubmissions || [];
  const onNavigate = props?.onNavigate || (() => {});
  const onUpdateState = props?.onUpdateState || (() => {});

  const quest = allQuests.find((q) => q.id === questId) || allQuests[0];
  const questState = questStates[quest ? quest.id : '']?.status || 'available';
  const [showModal, setShowModal] = useState(false);

  if (!quest) return null;

  const handleAccept = () => {
    const updated = {
      ...questStates,
      [quest.id]: { questId: quest.id, status: 'active' as const, acceptedAt: new Date().toISOString() },
    };
    saveQuestStates(updated);
    onUpdateState(user, updated, proofSubmissions);
  };

  const handleProofVerifiedSuccess = (q: Quest, submission: ProofSubmission) => {
    setShowModal(false);

    const awardResult = awardQuestCompletion(user, q.xpReward, q.co2ImpactKg);
    saveUserProfile(awardResult.updatedProfile);

    const updatedStates = {
      ...questStates,
      [q.id]: { questId: q.id, status: 'completed' as const, completedAt: new Date().toISOString(), proofId: submission.id },
    };
    saveQuestStates(updatedStates);

    const updatedProofs = [submission, ...proofSubmissions];
    saveProofSubmissions(updatedProofs);

    onUpdateState(awardResult.updatedProfile, updatedStates, updatedProofs);
    onNavigate('/dashboard');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 text-left max-w-3xl mx-auto">
      <button onClick={() => onNavigate('/quests')} className="font-mono text-xs font-bold text-[#10b981] hover:underline">
        ← Back to Quests Catalog
      </button>

      <GlassCard glow className="p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <span className="font-mono text-xs font-bold text-amber-700">+{quest.xpReward} EcoXP</span>
          <span className="font-mono text-xs text-emerald-800 font-bold uppercase border border-emerald-300 bg-emerald-50 px-3 py-1 rounded-full">
            {quest.verificationType.replace('_', ' ')}
          </span>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{quest.title}</h1>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed font-medium">{quest.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 font-mono text-xs text-gray-700">
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-center">
            <div className="text-emerald-700 font-black">-{quest.co2ImpactKg} kg</div>
            <div className="text-[10px] uppercase font-bold text-gray-500">CO₂ Impact</div>
          </div>
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-center">
            <div className="text-amber-700 font-black">{quest.duration}</div>
            <div className="text-[10px] uppercase font-bold text-gray-500">Duration</div>
          </div>
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-center">
            <div className="text-gray-900 font-black">{quest.difficulty}</div>
            <div className="text-[10px] uppercase font-bold text-gray-500">Difficulty</div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <h4 className="font-mono text-xs font-bold text-emerald-800 uppercase">Verification Requirement Summary</h4>
          <p className="mt-1 text-xs text-gray-700 font-medium">{quest.requirementsSummary}</p>
        </div>

        <div className="pt-2">
          {questState === 'completed' ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-center text-sm font-bold text-emerald-800">
              ✓ Quest Verified & Completed
            </div>
          ) : questState === 'active' ? (
            <button
              onClick={() => setShowModal(true)}
              className="w-full rounded-2xl bg-[#111827] py-3.5 text-sm font-bold text-white hover:bg-black transition-all shadow-sm"
            >
              Submit Action Proof & Verify
            </button>
          ) : (
            <button
              onClick={handleAccept}
              className="w-full rounded-2xl bg-[#111827] py-3.5 text-sm font-bold text-white hover:bg-black transition-all shadow-sm"
            >
              Accept Quest & Begin Real-World Action
            </button>
          )}
        </div>
      </GlassCard>

      <VerificationModal
        quest={quest}
        isOpen={showModal}
        userId={user.id}
        userName={user.name}
        previousSubmissions={proofSubmissions}
        onClose={() => setShowModal(false)}
        onVerifiedSuccess={handleProofVerifiedSuccess}
      />
    </div>
  );
}
