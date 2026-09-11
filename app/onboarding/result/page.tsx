'use client';

import React from 'react';
import { CarbonResult, UserProfile } from '@/types';
import { GlassCard } from '../../../components/ui/GlassCard';

interface ResultPageProps {
  result: CarbonResult;
  user: UserProfile;
  onFinishOnboarding: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ result, user, onFinishOnboarding }) => {
  const targetGoalKg = Math.round(result.totalMonthlyKgCO2e * 0.88);
  const reductionTargetKg = result.totalMonthlyKgCO2e - targetGoalKg;

  return (
    <div className="space-y-6 text-left">
      <div className="text-center">
        <span className="font-mono text-xs font-bold text-[#6bfb9a]">STEP 4 OF 4 • CARBON RESULT & AI PERSONA</span>
        <h1 className="font-display-lg text-3xl font-extrabold text-white mt-1">
          {result.totalMonthlyKgCO2e} kg CO₂e / month
        </h1>
        <p className="text-xs text-[#bccabb] mt-1">
          Yearly Baseline Footprint: <strong className="text-white font-mono">{result.yearlyBaselineTonnes} tonnes CO₂e</strong>
        </p>
      </div>

      {/* Category Breakdown Bar Chart */}
      <GlassCard className="p-5">
        <h3 className="font-headline-lg text-sm font-bold text-white mb-3">Category Breakdown Share</h3>
        <div className="space-y-3">
          {result.breakdown.map((cat) => (
            <div key={cat.category}>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#e4e2de] flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-[#6bfb9a]">{cat.icon}</span>
                  {cat.name}
                </span>
                <span className="text-[#6bfb9a] font-bold">{cat.amountKg} kg ({cat.percentage}%)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-[#6bfb9a]" style={{ width: `${cat.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[#ffd23f] font-mono">
          📍 Biggest Reduction Opportunity: <strong>{result.hotspotCategory.toUpperCase()}</strong>
        </p>
      </GlassCard>

      {/* AI Persona Reveal */}
      <GlassCard glow className="border-l-4 border-l-[#ffd23f]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd23f]/20 text-[#ffd23f]">
            <span className="material-symbols-outlined text-3xl">military_tech</span>
          </div>
          <div>
            <span className="font-mono text-xs text-[#ffd23f] font-bold">AI GREEN PERSONA ASSIGNED</span>
            <h3 className="font-display-lg text-xl font-bold text-white">🚗 Carbon Challenger ({user.persona})</h3>
          </div>
        </div>
        <p className="mt-3 text-xs text-[#bccabb] leading-relaxed">
          Transportation is currently your largest emission contributor. Switching two weekly car trips to public transit or Pune Metro will lower your footprint substantially.
        </p>
      </GlassCard>

      {/* Mission Goal */}
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center">
        <span className="font-mono text-xs font-bold text-emerald-400">FIRST MISSION TARGET</span>
        <h3 className="font-display-lg text-lg font-bold text-white mt-1">
          Reduce {reductionTargetKg} kg CO₂e this month (Target: {targetGoalKg} kg CO₂e)
        </h3>
      </div>

      <button
        onClick={onFinishOnboarding}
        className="w-full rounded-2xl bg-[#6bfb9a] py-3.5 text-sm font-extrabold text-[#003919] hover:bg-[#59e68a] transition-all shadow-xl"
      >
        Enter EcoQuest Canopy Dashboard →
      </button>
    </div>
  );
};

export default ResultPage;
