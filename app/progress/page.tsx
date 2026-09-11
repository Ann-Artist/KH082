'use client';

import React from 'react';
import { UserProfile } from '@/types';
import { ProgressionTree } from '../../components/gamification/ProgressionTree';
import { GlassCard } from '../../components/ui/GlassCard';

import { getStoredUserProfile } from '../../lib/storage';

interface ProgressPageProps {
  user?: UserProfile;
}

const ProgressPage: React.FC<ProgressPageProps> = ({ user: propUser }) => {
  const user = propUser || getStoredUserProfile();
  return (
    <div className="space-y-8 pb-20 md:pb-8">
      <div>
        <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-white">Eco Journey Level Tree</h1>
        <p className="text-xs text-[#bccabb]">Visual progression roadmap from Eco Seedling to Planet Champion.</p>
      </div>

      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="font-mono text-xs text-[#6bfb9a] font-bold">CURRENT STATUS</span>
            <h2 className="font-display-lg text-2xl font-bold text-white">Level {user.level}: {user.levelTitle}</h2>
          </div>

          <div className="rounded-2xl border border-[#ffd23f]/30 bg-[#ffd23f]/10 px-4 py-2 text-right font-mono">
            <div className="text-xs text-[#bccabb]">Total EcoXP Ledger</div>
            <div className="text-xl font-bold text-[#ffd23f]">{user.ecoXP} XP</div>
          </div>
        </div>

        <ProgressionTree user={user} />
      </GlassCard>
    </div>
  );
};

export default ProgressPage;
