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
                className={`w-[42%] rounded-2xl border p-5 transition-all ${
                  isCurrent
                    ? 'border-amber-300 bg-amber-50 text-gray-900 shadow-sm'
                    : isUnlocked
                    ? 'border-emerald-200 bg-white text-gray-900 shadow-sm'
                    : 'border-gray-200 bg-gray-50 text-gray-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-[#10b981]">
                    Level {tier.level}
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-700">
                    {tier.minXP} XP Required
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-extrabold text-gray-900">
                  {tier.title} {isCurrent && ' (YOU ARE HERE)'}
                </h3>

                <p className="mt-1 text-xs text-gray-600 font-medium">
                  {isUnlocked
                    ? 'Status: Tier Unlocked & Verified'
                    : 'Status: Locked (Accumulate EcoXP to unlock)'}
                </p>
              </div>

              {/* Node Badge Center */}
              <div
                className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 font-mono font-black text-lg transition-all ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-400 text-gray-900 shadow-md scale-110'
                    : isUnlocked
                    ? 'border-[#10b981] bg-[#10b981] text-white'
                    : 'border-gray-300 bg-gray-100 text-gray-400'
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
