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

export const QuestDetailPage: React.FC<QuestDetailPageProps> = ({
  questId,
  allQuests,
  user,
  questStates,
  proofSubmissions,
  onNavigate,
  onUpdateState,
}) => {
  const quest = allQuests.find((q) => q.id === questId) || allQuests[0];
  const questState = questStates[quest.id]?.status || 'available';
  const [showModal, setShowModal] = useState(false);

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
      <button onClick={() => onNavigate('/quests')} className="font-mono text-xs text-[#6bfb9a] hover:underline">
        ← Back to Quests Catalog
      </button>

      <GlassCard glow className="p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="font-mono text-xs font-bold text-[#ffd23f]">+{quest.xpReward} EcoXP</span>
          <span className="font-mono text-xs text-[#6bfb9a] uppercase border border-[#6bfb9a]/30 px-3 py-1 rounded-full">
            {quest.verificationType.replace('_', ' ')}
          </span>
        </div>

        <div>
          <h1 className="font-display-lg text-2xl md:text-3xl font-extrabold text-white">{quest.title}</h1>
          <p className="mt-2 text-sm text-[#bccabb] leading-relaxed">{quest.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 font-mono text-xs text-[#bccabb]">
          <div className="rounded-xl bg-white/5 p-3 text-center">
            <div className="text-[#6bfb9a] font-bold">-{quest.co2ImpactKg} kg</div>
            <div className="text-[10px] uppercase">CO₂ Impact</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3 text-center">
            <div className="text-[#ffd23f] font-bold">{quest.duration}</div>
            <div className="text-[10px] uppercase">Duration</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3 text-center">
            <div className="text-white font-bold">{quest.difficulty}</div>
            <div className="text-[10px] uppercase">Difficulty</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <h4 className="font-mono text-xs font-bold text-[#6bfb9a] uppercase">Verification Requirement Summary</h4>
          <p className="mt-1 text-xs text-[#e4e2de]">{quest.requirementsSummary}</p>
        </div>

        <div className="pt-2">
          {questState === 'completed' ? (
            <div className="rounded-2xl bg-emerald-500/20 p-4 text-center text-sm font-bold text-emerald-400">
              ✓ Quest Verified & Completed
            </div>
          ) : questState === 'active' ? (
            <button
              onClick={() => setShowModal(true)}
              className="w-full rounded-2xl bg-[#6bfb9a] py-3.5 text-sm font-bold text-[#003919] hover:bg-[#59e68a]"
            >
              Submit Action Proof & Verify
            </button>
          ) : (
            <button
              onClick={handleAccept}
              className="w-full rounded-2xl bg-[#6bfb9a] py-3.5 text-sm font-bold text-[#003919] hover:bg-[#59e68a]"
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
};

export default QuestDetailPage;
