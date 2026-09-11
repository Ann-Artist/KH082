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
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Achievement Badges</h1>
        <p className="text-xs text-gray-600 font-medium">Unlocked milestones & in-progress achievement medallions.</p>
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
                    ? 'border-amber-400 bg-amber-50 text-amber-600 shadow-md'
                    : 'border-gray-200 bg-gray-100 text-gray-400'
                }`}
              >
                <span className="material-symbols-outlined text-3xl">{badge.icon}</span>
              </div>

              <h3 className="mt-4 text-lg font-extrabold text-gray-900">{badge.title}</h3>
              <p className="mt-1 text-xs text-gray-600 leading-relaxed font-medium">{badge.description}</p>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between font-mono text-xs">
                <span className="text-gray-500 font-medium">Status:</span>
                <span className={isUnlocked ? 'text-emerald-700 font-extrabold' : 'text-amber-700 font-bold'}>
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
