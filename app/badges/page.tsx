'use client';

import React from 'react';
import { UserProfile, Badge } from '@/types';
import { GlassCard } from '../../components/ui/GlassCard';
import badgesData from '../../data/badges.json';

import { getStoredUserProfile } from '../../lib/storage';

export default function BadgesPage(props: any) {
  const user = props?.user || getStoredUserProfile();
  const badgesList = badgesData as Badge[];

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      <div>
        <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-white">Achievement Badges</h1>
        <p className="text-xs text-[#bccabb]">Unlocked milestones & in-progress achievement medallions.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {badgesList.map((badge) => {
          let isUnlocked = false;
          let progressText = '';

          if (badge.requiredXP) {
            isUnlocked = user.ecoXP >= badge.requiredXP;
            progressText = `${user.ecoXP} / ${badge.requiredXP} XP`;
          } else if (badge.requiredStreak) {
            isUnlocked = user.streakDays >= badge.requiredStreak;
            progressText = `${user.streakDays} / ${badge.requiredStreak} Days`;
          } else if (badge.requiredQuests) {
            isUnlocked = user.completedQuestsCount >= badge.requiredQuests;
            progressText = `${user.completedQuestsCount} / ${badge.requiredQuests} Quests`;
          }

          return (
            <GlassCard key={badge.id} glow={isUnlocked} className="p-6 text-center">
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all ${
                  isUnlocked
                    ? 'border-[#ffd23f] bg-[#ffd23f]/20 text-[#ffd23f] shadow-[0_0_20px_rgba(255,210,63,0.4)]'
                    : 'border-white/10 bg-white/5 text-white/30'
                }`}
              >
                <span className="material-symbols-outlined text-3xl">{badge.icon}</span>
              </div>

              <h3 className="mt-4 font-headline-lg text-lg font-bold text-white">{badge.title}</h3>
              <p className="mt-1 text-xs text-[#bccabb] leading-relaxed">{badge.description}</p>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                <span className="text-[#bccabb]">Status:</span>
                <span className={isUnlocked ? 'text-[#6bfb9a] font-bold' : 'text-[#ffd23f]'}>
                  {isUnlocked ? '✓ UNLOCKED' : `In Progress (${progressText})`}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
