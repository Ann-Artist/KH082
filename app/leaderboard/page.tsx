'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types';
import { getPuneLeaderboard } from '../../lib/gamification/leaderboard';
import { getStoredUserProfile } from '../../lib/storage';
import { GlassCard } from '../../components/ui/GlassCard';
import { ShareCardCanvas } from '../../components/leaderboard/ShareCardCanvas';

export default function LeaderboardPage(props: any) {
  const user = props?.user || getStoredUserProfile();
  const [scope, setScope] = useState<'city' | 'ward' | 'friends'>('city');

  const { entries, currentUserRank } = getPuneLeaderboard(user, scope);

  const top3 = entries.slice(0, 3);
  const remaining = entries.slice(3);

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Pune Wall of Champions</h1>
          <p className="text-xs text-gray-600 font-medium">Top Eco Warriors in Pune City & Regional Wards</p>
        </div>

        {/* Scope Control */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 font-mono text-xs shadow-sm">
          <button
            onClick={() => setScope('city')}
            className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
              scope === 'city' ? 'bg-[#111827] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            City-Wide
          </button>
          <button
            onClick={() => setScope('ward')}
            className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
              scope === 'ward' ? 'bg-[#111827] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Ward ({user.puneWard.split(' ')[0]})
          </button>
          <button
            onClick={() => setScope('friends')}
            className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
              scope === 'friends' ? 'bg-[#111827] text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Friends
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Podium & Leaderboard Table */}
        <div className="space-y-6 lg:col-span-8">
          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 md:gap-4 items-end h-64 md:h-72">
              {/* Rank 2 */}
              <GlassCard className="text-center p-3 h-[85%] flex flex-col justify-end border-slate-300">
                <div className="relative mx-auto mb-2 h-14 w-14 md:h-16 md:w-16 rounded-full border-2 border-slate-400 overflow-hidden">
                  <img src={top3[1].avatarUrl} alt={top3[1].name} className="h-full w-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 text-xs font-mono font-bold text-black">
                    2
                  </span>
                </div>
                <h3 className="truncate font-bold text-xs md:text-sm text-gray-900">{top3[1].name}</h3>
                <p className="font-mono text-[10px] text-emerald-700 font-bold">{top3[1].puneWard}</p>
                <div className="mt-1 font-mono text-xs font-black text-amber-700">{top3[1].ecoXP} XP</div>
              </GlassCard>

              {/* Rank 1 (Tallest) */}
              <GlassCard glow className="text-center p-4 h-full flex flex-col justify-end border-amber-300 bg-amber-50">
                <div className="relative mx-auto mb-2 h-16 w-16 md:h-20 md:w-20 rounded-full border-4 border-amber-400 overflow-hidden shadow-md">
                  <img src={top3[0].avatarUrl} alt={top3[0].name} className="h-full w-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-xs font-mono font-bold text-gray-900">
                    👑 1
                  </span>
                </div>
                <h3 className="truncate font-bold text-sm md:text-base text-gray-900">{top3[0].name}</h3>
                <p className="font-mono text-xs text-emerald-700 font-bold">{top3[0].puneWard}</p>
                <div className="mt-1 font-mono text-sm font-black text-amber-700">{top3[0].ecoXP} XP</div>
              </GlassCard>

              {/* Rank 3 */}
              <GlassCard className="text-center p-3 h-[75%] flex flex-col justify-end border-amber-200">
                <div className="relative mx-auto mb-2 h-14 w-14 md:h-16 md:w-16 rounded-full border-2 border-amber-600 overflow-hidden">
                  <img src={top3[2].avatarUrl} alt={top3[2].name} className="h-full w-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-xs font-mono font-bold text-white">
                    3
                  </span>
                </div>
                <h3 className="truncate font-bold text-xs md:text-sm text-gray-900">{top3[2].name}</h3>
                <p className="font-mono text-[10px] text-emerald-700 font-bold">{top3[2].puneWard}</p>
                <div className="mt-1 font-mono text-xs font-black text-amber-700">{top3[2].ecoXP} XP</div>
              </GlassCard>
            </div>
          )}

          {/* Full Ranked Table */}
          <GlassCard className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm text-gray-900">
              <thead className="border-b border-gray-100 bg-gray-50 font-mono text-xs uppercase text-gray-500 font-bold">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Eco Warrior</th>
                  <th className="py-3 px-4">Pune Ward</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4 text-right">EcoXP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold">
                {entries.map((entry) => (
                  <tr
                    key={entry.userId}
                    className={`transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-emerald-50 text-gray-900 font-bold border-l-4 border-l-[#10b981]'
                        : 'hover:bg-gray-50/80'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-amber-700">#{entry.rank}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={entry.avatarUrl} alt={entry.name} className="h-8 w-8 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-gray-900">{entry.name} {entry.isCurrentUser && '(You)'}</div>
                          <div className="text-[11px] font-mono text-gray-500">@{entry.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-emerald-700 font-bold">{entry.puneWard}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-700">{entry.persona}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">{entry.ecoXP} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>

        {/* Right Column: Social Achievement Share Card */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-extrabold text-gray-900">Your Social Achievement Card</h2>
          <ShareCardCanvas user={user} userRank={currentUserRank} />
        </div>
      </div>
    </div>
  );
}
