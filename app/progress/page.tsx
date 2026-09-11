'use client';

import React from 'react';
import { UserProfile } from '@/types';
import { ProgressionTree } from '../../components/gamification/ProgressionTree';
import { GlassCard } from '../../components/ui/GlassCard';

import { getStoredUserProfile } from '../../lib/storage';

export default function ProgressPage(props: any) {
  const user = props?.user || getStoredUserProfile();
  return (
    <div className="space-y-8 pb-20 md:pb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Eco Journey Level Tree</h1>
        <p className="text-xs text-gray-600 font-medium">Visual progression roadmap from Eco Seedling to Planet Champion.</p>
      </div>

      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <span className="font-mono text-xs text-[#10b981] font-bold">CURRENT STATUS</span>
            <h2 className="text-2xl font-extrabold text-gray-900">Level {user.level}: {user.levelTitle}</h2>
          </div>

          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2 text-right font-mono">
            <div className="text-xs text-amber-800 font-medium">Total EcoXP Ledger</div>
            <div className="text-xl font-black text-amber-700">{user.ecoXP} XP</div>
          </div>
        </div>

        <ProgressionTree user={user} />
      </GlassCard>
    </div>
  );
}
