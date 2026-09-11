'use client';

import React from 'react';
import { UserProfile, CarbonResult } from '@/types';
import { GlassCard } from '../../components/ui/GlassCard';
import { generateWeeklyReport } from '../../lib/ai/advisor';
import { getStoredUserProfile, getStoredCarbonResult } from '../../lib/storage';

export default function ImpactPage(props: any) {
  const user = props?.user || getStoredUserProfile();
  const carbonResult = props?.carbonResult || getStoredCarbonResult();
  const weeklyReport = generateWeeklyReport(user, carbonResult, user.completedQuestsCount);

  const beforeFootprint = 182; // Baseline footprint kg/month
  const currentFootprint = Math.max(100, beforeFootprint - user.totalCO2AvoidedKg);
  const totalAvoided = Math.round((beforeFootprint - currentFootprint) * 10) / 10;

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-white">CO₂ Environmental Impact Dashboard</h1>
        <p className="text-xs text-[#bccabb]">Track real-world emissions avoided & AI weekly progress summary.</p>
      </div>

      {/* Hero Before vs After Metric Comparison */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard className="text-center p-6 border-red-500/20 bg-gradient-to-b from-red-500/10 to-transparent">
          <div className="text-xs font-mono text-red-400 uppercase">Initial Baseline Footprint</div>
          <div className="mt-2 font-mono text-3xl font-black text-white">{beforeFootprint} kg</div>
          <div className="mt-1 text-xs text-[#bccabb]">CO₂e / month</div>
        </GlassCard>

        <GlassCard className="text-center p-6 border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-transparent">
          <div className="text-xs font-mono text-emerald-400 uppercase">Current Estimated Footprint</div>
          <div className="mt-2 font-mono text-3xl font-black text-[#6bfb9a]">{currentFootprint} kg</div>
          <div className="mt-1 text-xs text-[#bccabb]">CO₂e / month</div>
        </GlassCard>

        <GlassCard glow className="text-center p-6 border-[#ffd23f]/30 bg-gradient-to-b from-[#ffd23f]/10 to-transparent">
          <div className="text-xs font-mono text-[#ffd23f] uppercase">Total Emissions Prevented</div>
          <div className="mt-2 font-mono text-3xl font-black text-[#ffd23f]">-{totalAvoided} kg</div>
          <div className="mt-1 text-xs text-[#bccabb]">Verified Eco Reduction</div>
        </GlassCard>
      </div>

      {/* AI Weekly Sustainability Report Card */}
      <GlassCard glow className="border-l-4 border-l-[#7c3aed]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7c3aed]/20 text-[#7c3aed]">
            <span className="material-symbols-outlined text-3xl">auto_awesome</span>
          </div>
          <div>
            <span className="rounded-full border border-[#7c3aed]/40 bg-[#7c3aed]/10 px-3 py-1 font-mono text-xs font-bold text-[#7c3aed]">
              AI Weekly Report • Nature Journal Rationale
            </span>
            <h2 className="mt-2 font-display-lg text-xl font-extrabold text-white">{weeklyReport.headline}</h2>
          </div>
        </div>

        <p className="mt-4 text-sm text-[#e4e2de] leading-relaxed">{weeklyReport.body}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
            <span className="font-mono font-bold text-[#6bfb9a] uppercase">Top Weekly Achievement</span>
            <p className="mt-1 text-[#bccabb]">{weeklyReport.topAchievement}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
            <span className="font-mono font-bold text-[#ffd23f] uppercase">AI Recommended Next Focus</span>
            <p className="mt-1 text-[#bccabb]">{weeklyReport.nextFocusArea}</p>
          </div>
        </div>
      </GlassCard>

      {/* Category Breakdown & Improvement Progress */}
      <div>
        <h2 className="mb-4 font-headline-lg text-xl font-bold text-white">Category Emission Share & Hotspots</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {carbonResult.breakdown.map((cat: any) => (
            <GlassCard key={cat.category} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-[#6bfb9a]">{cat.icon}</span>
                  <div>
                    <h3 className="font-title-md text-base font-bold text-white">{cat.name}</h3>
                    <p className="text-xs text-[#bccabb]">{cat.amountKg} kg CO₂e / month ({cat.percentage}%)</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${
                    cat.priority === 'HIGH'
                      ? 'border border-red-500/30 bg-red-500/10 text-red-400'
                      : cat.priority === 'MEDIUM'
                      ? 'border border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                      : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {cat.priority} PRIORITY
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#6bfb9a]"
                  style={{ width: `${Math.min(100, (cat.amountKg / 150) * 100)}%` }}
                />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
