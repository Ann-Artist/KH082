import React from 'react';
import { UserProfile, CarbonResult } from '../../types';
import { calculateLevelFromXP } from '../../lib/gamification/xp';

interface HeroCanopyCardProps {
  user: UserProfile;
  carbonResult: CarbonResult;
  onNavigateQuests: () => void;
}

export const HeroCanopyCard: React.FC<HeroCanopyCardProps> = ({
  user,
  carbonResult,
  onNavigateQuests,
}) => {
  const levelInfo = calculateLevelFromXP(user.ecoXP);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#6bfb9a]/20 bg-gradient-to-br from-[#121c16] via-[#0f1813] to-[#0b110e] p-6 shadow-2xl md:p-8">
      {/* Bioluminescent Background Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#6bfb9a]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#7c3aed]/15 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Left Column: User Persona & Level */}
        <div className="lg:col-span-7">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full border border-[#6bfb9a]/30 bg-[#6bfb9a]/10 px-3 py-1 font-mono text-xs font-semibold text-[#6bfb9a]">
              Level {user.level} • {user.persona}
            </span>
            <span className="rounded-full border border-[#ffd23f]/30 bg-[#ffd23f]/10 px-3 py-1 font-mono text-xs font-semibold text-[#ffd23f]">
              🔥 {user.streakDays}-Day Streak
            </span>
          </div>

          <h1 className="font-display-lg text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Welcome back, <span className="text-[#6bfb9a]">{user.name}</span>!
          </h1>
          
          <p className="mt-2 text-sm text-[#bccabb] md:text-base">
            Your monthly footprint is estimated at{' '}
            <strong className="text-white font-mono">{carbonResult.totalMonthlyKgCO2e} kg CO₂e</strong>. 
            Your biggest reduction opportunity is in{' '}
            <span className="text-[#6bfb9a] font-bold underline">{carbonResult.hotspotCategory.toUpperCase()}</span>.
          </p>

          {/* XP Progress Bar */}
          <div className="mt-6 rounded-2xl border border-white/5 bg-black/30 p-4 backdrop-blur-md">
            <div className="mb-1.5 flex items-center justify-between text-xs font-mono">
              <span className="text-[#bccabb]">Progress to Level {levelInfo.level + 1}</span>
              <span className="font-bold text-[#ffd23f]">
                {levelInfo.currentLevelXP} / {levelInfo.nextLevelXP} XP ({levelInfo.progressPercent}%)
              </span>
            </div>

            <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6bfb9a] via-[#4ade80] to-[#ffd23f] transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Key Hero Metrics */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-5 md:gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
            <span className="material-symbols-outlined text-3xl text-[#6bfb9a]">eco</span>
            <div className="mt-1 font-mono text-2xl font-black text-white">{user.totalCO2AvoidedKg} kg</div>
            <div className="text-xs text-[#bccabb]">CO₂e Avoided</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
            <span className="material-symbols-outlined text-3xl text-[#ffd23f]">task_alt</span>
            <div className="mt-1 font-mono text-2xl font-black text-white">{user.completedQuestsCount}</div>
            <div className="text-xs text-[#bccabb]">Quests Verified</div>
          </div>

          <div className="col-span-2">
            <button
              onClick={onNavigateQuests}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#6bfb9a]/40 bg-[#6bfb9a] py-3.5 font-bold text-[#003919] shadow-lg transition-all hover:bg-[#59e889] hover:shadow-[0_0_20px_rgba(107,251,154,0.4)] active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-xl">play_arrow</span>
              <span>View Active & Recommended Quests</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
