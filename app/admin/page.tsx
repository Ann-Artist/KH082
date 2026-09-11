'use client';

import React, { useState } from 'react';
import { UserProfile, Quest, ProofSubmission, CarbonCategory, VerificationType } from '@/types';
import { GlassCard } from '../../components/ui/GlassCard';
import { saveCustomQuest, saveProofSubmissions } from '../../lib/storage';

import { getStoredUserProfile, getAllQuests, getStoredProofSubmissions } from '../../lib/storage';

export default function AdminPage(props: any) {
  const user = props?.user || getStoredUserProfile();
  const allQuests = props?.allQuests || getAllQuests();
  const proofSubmissions = props?.proofSubmissions || getStoredProofSubmissions(user.id);
  const onUpdateState = props?.onUpdateState;
  const [activeTab, setActiveTab] = useState<'review' | 'quests'>('review');

  // Create Quest state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CarbonCategory>('transportation');
  const [newXp, setNewXp] = useState(100);
  const [newImpact, setNewImpact] = useState(3.5);
  const [newVerification, setNewVerification] = useState<VerificationType>('level_3_photo');
  const [newDesc, setNewDesc] = useState('');
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuest: Quest = {
      id: `quest_custom_${Date.now()}`,
      title: newTitle,
      description: newDesc,
      category: newCategory,
      difficulty: 'Intermediate',
      xpReward: newXp,
      co2ImpactKg: newImpact,
      verificationType: newVerification,
      duration: 'Weekly',
      icon: newCategory === 'transportation' ? 'directions_bus' : newCategory === 'waste' ? 'recycling' : 'eco',
      requirementsSummary: 'Admin authored eco quest challenge',
    };

    saveCustomQuest(newQuest);
    setCreatedSuccess(true);
    setNewTitle('');
    setNewDesc('');
    setTimeout(() => setCreatedSuccess(false), 3000);
  };

  const handleAuditReview = (submissionId: string, approve: boolean) => {
    const updated = proofSubmissions.map((p: ProofSubmission) => {
      if (p.id === submissionId) {
        return {
          ...p,
          status: approve ? ('approved' as const) : ('rejected' as const),
          aiVerdict: approve ? ('Approved' as const) : ('Rejected' as const),
        };
      }
      return p;
    });

    saveProofSubmissions(updated);
    if (typeof onUpdateState === 'function') {
      onUpdateState(user, {}, updated);
    }
  };

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-white">EcoQuest Operational Admin Console</h1>
          <p className="text-xs text-[#bccabb]">Manage quest catalogs, inspect AI verdicts & EcoGuard verification queue.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#121b16] p-1 font-mono text-xs">
          <button
            onClick={() => setActiveTab('review')}
            className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
              activeTab === 'review' ? 'bg-[#6bfb9a] text-[#003919]' : 'text-[#bccabb] hover:text-white'
            }`}
          >
            EcoGuard Queue ({proofSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
              activeTab === 'quests' ? 'bg-[#6bfb9a] text-[#003919]' : 'text-[#bccabb] hover:text-white'
            }`}
          >
            Quest Catalog CRUD ({allQuests.length})
          </button>
        </div>
      </div>

      {/* Tab 1: EcoGuard Verification Review Queue */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          <h2 className="font-headline-lg text-lg font-bold text-white">Pending & Flagged Verification Submissions</h2>

          <GlassCard className="overflow-x-auto p-0">
            <table className="w-full text-left text-xs text-[#e4e2de]">
              <thead className="border-b border-white/10 bg-white/5 font-mono uppercase text-[#bccabb]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Quest</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">AI Verdict</th>
                  <th className="py-3 px-4">EcoGuard Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {proofSubmissions.map((proof: ProofSubmission) => (
                  <tr key={proof.id} className="hover:bg-white/5">
                    <td className="py-3 px-4 font-semibold text-white">{proof.userName}</td>
                    <td className="py-3 px-4 font-mono">{proof.questTitle}</td>
                    <td className="py-3 px-4 uppercase font-mono text-[#6bfb9a]">{proof.verificationType.replace('_', ' ')}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className={proof.aiVerdict === 'Approved' ? 'text-emerald-400 font-bold' : 'text-yellow-400 font-bold'}>
                        {proof.aiVerdict} ({Math.round(proof.aiConfidence * 100)}%)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] font-mono">
                      {proof.ecoGuardFlagged ? (
                        <span className="text-red-400 font-bold">⚠️ FLAGGED: {proof.ecoGuardReason}</span>
                      ) : (
                        <span className="text-emerald-400">Clear</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {proof.status === 'approved' ? (
                        <span className="font-mono text-emerald-400 font-bold">Approved</span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAuditReview(proof.id, true)}
                            className="rounded-lg bg-emerald-500/20 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/30"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAuditReview(proof.id, false)}
                            className="rounded-lg bg-red-500/20 px-2.5 py-1 font-mono text-[11px] font-bold text-red-400 hover:bg-red-500/30"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}

      {/* Tab 2: Quest Authoring CRUD */}
      {activeTab === 'quests' && (
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <h2 className="font-headline-lg text-lg font-bold text-white">Author New Quest Challenge</h2>

            {createdSuccess && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-300">
                ✨ New Quest created successfully and added to the Pune Catalog!
              </div>
            )}

            <form onSubmit={handleCreateQuest} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-mono text-[#bccabb] mb-1">Quest Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="e.g. Pune Solar Energy Sprint"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#bccabb] mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CarbonCategory)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
                >
                  <option value="transportation">Transportation</option>
                  <option value="electricity">Electricity</option>
                  <option value="food">Food & Diet</option>
                  <option value="shopping">Shopping</option>
                  <option value="waste">Waste Management</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#bccabb] mb-1">EcoXP Reward</label>
                <input
                  type="number"
                  value={newXp}
                  onChange={(e) => setNewXp(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#bccabb] mb-1">Verification Level</label>
                <select
                  value={newVerification}
                  onChange={(e) => setNewVerification(e.target.value as VerificationType)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
                >
                  <option value="level_1_self">Level 1: Self-Reported</option>
                  <option value="level_2_gps">Level 2: Smart GPS / Route</option>
                  <option value="level_3_photo">Level 3: Photo Proof Required</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-mono text-[#bccabb] mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-[#6bfb9a] px-6 py-2.5 text-xs font-bold text-[#003919] hover:bg-[#59e68a] transition-all"
                >
                  Publish Quest to Pune Catalog
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
