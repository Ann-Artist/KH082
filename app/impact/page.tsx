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
    <div className="space-y-8 pb-20 md:pb-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">CO₂ Environmental Impact Dashboard</h1>
        <p className="text-xs text-gray-600">Track real-world emissions avoided & AI weekly progress summary.</p>
      </div>

      {/* Hero Before vs After Metric Comparison */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard className="text-center p-6 border-red-200 bg-gradient-to-b from-red-50 to-white">
          <div className="text-xs font-mono font-bold text-red-600 uppercase">Initial Baseline Footprint</div>
          <div className="mt-2 font-mono text-3xl font-black text-gray-900">{beforeFootprint} kg</div>
          <div className="mt-1 text-xs text-gray-500 font-semibold">CO₂e / month</div>
        </GlassCard>

        <GlassCard className="text-center p-6 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white">
          <div className="text-xs font-mono font-bold text-emerald-700 uppercase">Current Estimated Footprint</div>
          <div className="mt-2 font-mono text-3xl font-black text-[#10b981]">{currentFootprint} kg</div>
          <div className="mt-1 text-xs text-gray-500 font-semibold">CO₂e / month</div>
        </GlassCard>

        <GlassCard glow className="text-center p-6 border-amber-200 bg-gradient-to-b from-amber-50 to-white">
          <div className="text-xs font-mono font-bold text-amber-600 uppercase">Total Emissions Prevented</div>
          <div className="mt-2 font-mono text-3xl font-black text-amber-600">-{totalAvoided} kg</div>
          <div className="mt-1 text-xs text-gray-500 font-semibold">Verified Eco Reduction</div>
        </GlassCard>
      </div>

      {/* AI Weekly Sustainability Report Card */}
      <GlassCard glow className="border-l-4 border-l-purple-600">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
            <span className="material-symbols-outlined text-3xl">auto_awesome</span>
          </div>
          <div>
            <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 font-mono text-xs font-bold text-purple-700">
              AI Weekly Report • Nature Journal Rationale
            </span>
            <h2 className="mt-2 text-xl font-extrabold text-gray-900">{weeklyReport.headline}</h2>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-700 leading-relaxed font-medium">{weeklyReport.body}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs">
            <span className="font-mono font-bold text-[#10b981] uppercase">Top Weekly Achievement</span>
            <p className="mt-1 text-gray-700 font-semibold">{weeklyReport.topAchievement}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs">
            <span className="font-mono font-bold text-amber-600 uppercase">AI Recommended Next Focus</span>
            <p className="mt-1 text-gray-700 font-semibold">{weeklyReport.nextFocusArea}</p>
          </div>
        </div>
      </GlassCard>

      {/* Category Breakdown & Improvement Progress */}
      <div>
        <h2 className="mb-4 text-xl font-extrabold text-gray-900">Category Emission Share & Hotspots</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {carbonResult.breakdown.map((cat: any) => (
            <GlassCard key={cat.category} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-[#10b981]">{cat.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{cat.name}</h3>
                    <p className="text-xs text-gray-500 font-semibold">{cat.amountKg} kg CO₂e / month ({cat.percentage}%)</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${
                    cat.priority === 'HIGH'
                      ? 'border border-red-200 bg-red-50 text-red-700'
                      : cat.priority === 'MEDIUM'
                      ? 'border border-amber-200 bg-amber-50 text-amber-700'
                      : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {cat.priority} PRIORITY
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#10b981]"
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
