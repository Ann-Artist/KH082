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
    <div className="relative overflow-hidden rounded-3xl border border-[#e2e8e3] bg-white p-6 text-gray-900 shadow-sm md:p-8">
      {/* Background Soft Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-50 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Left Column: User Persona & Level */}
        <div className="lg:col-span-7">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 font-mono text-xs font-bold text-emerald-800">
              Level {user.level} • {user.persona}
            </span>
            <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 font-mono text-xs font-bold text-amber-800">
              🔥 {user.streakDays}-Day Streak
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
            Welcome back, <span className="text-[#10b981]">{user.name}</span>!
          </h1>

          <p className="mt-2 text-sm text-gray-600 md:text-base">
            Your monthly footprint is estimated at{' '}
            <strong className="text-gray-900 font-mono">{carbonResult.totalMonthlyKgCO2e} kg CO₂e</strong>. 
            Your biggest reduction opportunity is in{' '}
            <span className="text-[#10b981] font-bold underline">{carbonResult.hotspotCategory.toUpperCase()}</span>.
          </p>

          {/* XP Progress Bar */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-1.5 flex items-center justify-between text-xs font-mono">
              <span className="text-gray-600 font-semibold">Progress to Level {levelInfo.level + 1}</span>
              <span className="font-extrabold text-amber-600">
                {levelInfo.currentLevelXP} / {levelInfo.nextLevelXP} XP ({levelInfo.progressPercent}%)
              </span>
            </div>

            <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#10b981] via-emerald-500 to-amber-500 transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Key Hero Metrics */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-5 md:gap-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
            <span className="material-symbols-outlined text-3xl text-[#10b981]">eco</span>
            <div className="mt-1 font-mono text-2xl font-black text-gray-900">{user.totalCO2AvoidedKg} kg</div>
            <div className="text-xs font-semibold text-gray-500">CO₂e Avoided</div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center">
            <span className="material-symbols-outlined text-3xl text-amber-500">task_alt</span>
            <div className="mt-1 font-mono text-2xl font-black text-gray-900">{user.completedQuestsCount}</div>
            <div className="text-xs font-semibold text-gray-500">Quests Verified</div>
          </div>

          <div className="col-span-2">
            <button
              onClick={onNavigateQuests}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] py-3.5 font-bold text-white shadow-sm transition-all hover:bg-black active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-xl text-[#10b981]">play_arrow</span>
              <span>View Active & Recommended Quests</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
