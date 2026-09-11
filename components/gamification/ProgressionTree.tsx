import React from 'react';
import { UserProfile, GreenPersonaTitle } from '../../types';
import { LEVEL_THRESHOLDS } from '../../lib/gamification/xp';

interface ProgressionTreeProps {
  user: UserProfile;
}

export const ProgressionTree: React.FC<ProgressionTreeProps> = ({ user }) => {
  return (
    <div className="relative py-8">
      {/* Connector Line */}
      <div className="absolute left-1/2 top-10 bottom-10 w-1 -translate-x-1/2 bg-gradient-to-b from-[#6bfb9a] via-[#4ade80] to-white/10" />

      <div className="space-y-12">
        {LEVEL_THRESHOLDS.map((tier) => {
          const isUnlocked = user.level >= tier.level;
          const isCurrent = user.level === tier.level;

          return (
            <div
              key={tier.level}
              className={`relative flex items-center justify-between gap-6 ${
                tier.level % 2 === 0 ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Card */}
              <div
                className={`w-[42%] rounded-2xl border p-5 backdrop-blur-xl transition-all ${
                  isCurrent
                    ? 'border-[#ffd23f] bg-gradient-to-r from-[#ffd23f]/15 to-[#121b16] shadow-[0_0_30px_rgba(255,210,63,0.25)]'
                    : isUnlocked
                    ? 'border-[#6bfb9a]/40 bg-[#121b16]/90 shadow-[0_0_20px_rgba(107,251,154,0.1)]'
                    : 'border-white/10 bg-black/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-[#6bfb9a]">
                    Level {tier.level}
                  </span>
                  <span className="font-mono text-xs text-[#ffd23f]">
                    {tier.minXP} XP Required
                  </span>
                </div>

                <h3 className="mt-2 font-display-lg text-lg font-bold text-white">
                  {tier.title} {isCurrent && ' (YOU ARE HERE)'}
                </h3>

                <p className="mt-1 text-xs text-[#bccabb]">
                  {isUnlocked
                    ? 'Status: Tier Unlocked & Verified'
                    : 'Status: Locked (Accumulate EcoXP to unlock)'}
                </p>
              </div>

              {/* Node Badge Center */}
              <div
                className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 font-mono font-black text-lg transition-all ${
                  isCurrent
                    ? 'border-[#ffd23f] bg-[#ffd23f] text-[#003919] shadow-[0_0_25px_rgba(255,210,63,0.8)] scale-110'
                    : isUnlocked
                    ? 'border-[#6bfb9a] bg-[#003919] text-[#6bfb9a]'
                    : 'border-white/20 bg-black/80 text-white/40'
                }`}
              >
                {isUnlocked ? '✓' : tier.level}
              </div>

              {/* Empty Spacer */}
              <div className="w-[42%]" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
