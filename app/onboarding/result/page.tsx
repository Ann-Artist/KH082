'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CarbonResult, UserProfile } from '@/types';
import { GlassCard } from '../../../components/ui/GlassCard';

interface ResultPageProps {
  result?: CarbonResult;
  user?: UserProfile;
  onFinishOnboarding?: () => void;
}

export default function ResultPage(props: any) {
  const router = useRouter();
  const result: CarbonResult = props?.result || { totalMonthlyKgCO2e: 182, yearlyBaselineTonnes: 2.18, hotspotCategory: 'transportation', breakdown: [] };
  const user: UserProfile = props?.user || { id: 'u1', name: 'Citizen', username: 'citizen', level: 1, ecoXP: 0, persona: 'Carbon Challenger', streakDays: 1, completedQuestsCount: 0, totalCO2AvoidedKg: 0, puneWard: 'Kothrud', ageGroup: 'Gen Z / Young Adult' };
  const targetGoalKg = Math.round(result.totalMonthlyKgCO2e * 0.88);
  const reductionTargetKg = result.totalMonthlyKgCO2e - targetGoalKg;

  const handleFinish = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (typeof props?.onFinishOnboarding === 'function') {
      props.onFinishOnboarding();
    }
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="text-center">
        <span className="font-mono text-xs font-bold text-[#10b981]">STEP 4 OF 4 • CARBON RESULT & AI PERSONA</span>
        <h1 className="text-3xl font-black text-gray-900 mt-1">
          {result.totalMonthlyKgCO2e} kg CO₂e / month
        </h1>
        <p className="text-xs text-gray-600 mt-1 font-medium">
          Yearly Baseline Footprint: <strong className="text-gray-900 font-mono">{result.yearlyBaselineTonnes} tonnes CO₂e</strong>
        </p>
      </div>

      {/* Category Breakdown Bar Chart */}
      <GlassCard className="p-5">
        <h3 className="text-sm font-extrabold text-gray-900 mb-3">Category Breakdown Share</h3>
        <div className="space-y-3">
          {result.breakdown.map((cat) => (
            <div key={cat.category}>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-gray-800 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-[#10b981]">{cat.icon}</span>
                  {cat.name}
                </span>
                <span className="text-emerald-700 font-bold">{cat.amountKg} kg ({cat.percentage}%)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full bg-[#10b981]" style={{ width: `${cat.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-amber-800 font-mono font-bold">
          📍 Biggest Reduction Opportunity: <strong>{result.hotspotCategory.toUpperCase()}</strong>
        </p>
      </GlassCard>

      {/* AI Persona Reveal */}
      <GlassCard glow className="border-l-4 border-l-amber-500">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <span className="material-symbols-outlined text-3xl">military_tech</span>
          </div>
          <div>
            <span className="font-mono text-xs text-amber-800 font-bold">AI GREEN PERSONA ASSIGNED</span>
            <h3 className="text-xl font-extrabold text-gray-900">🚗 Carbon Challenger ({user.persona})</h3>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-600 leading-relaxed font-medium">
          Transportation is currently your largest emission contributor. Switching two weekly car trips to public transit or Pune Metro will lower your footprint substantially.
        </p>
      </GlassCard>

      {/* Mission Goal */}
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center">
        <span className="font-mono text-xs font-bold text-emerald-800">FIRST MISSION TARGET</span>
        <h3 className="text-lg font-extrabold text-gray-900 mt-1">
          Reduce {reductionTargetKg} kg CO₂e this month (Target: {targetGoalKg} kg CO₂e)
        </h3>
      </div>

      <button
        type="button"
        onClick={handleFinish}
        className="w-full rounded-2xl bg-[#111827] py-3.5 text-sm font-extrabold text-white hover:bg-black transition-all shadow-sm cursor-pointer"
      >
        Enter EcoQuest Canopy Dashboard →
      </button>
    </div>
  );
}
