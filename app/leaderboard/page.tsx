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
          <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-white">Pune Wall of Champions</h1>
          <p className="text-xs text-[#bccabb]">Top Eco Warriors in Pune City & Regional Wards</p>
        </div>

        {/* Scope Control */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#121b16] p-1 font-mono text-xs">
          <button
            onClick={() => setScope('city')}
            className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
              scope === 'city' ? 'bg-[#6bfb9a] text-[#003919]' : 'text-[#bccabb] hover:text-white'
            }`}
          >
            City-Wide
          </button>
          <button
            onClick={() => setScope('ward')}
            className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
              scope === 'ward' ? 'bg-[#6bfb9a] text-[#003919]' : 'text-[#bccabb] hover:text-white'
            }`}
          >
            My Ward ({user.puneWard.split(' ')[0]})
          </button>
          <button
            onClick={() => setScope('friends')}
            className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
              scope === 'friends' ? 'bg-[#6bfb9a] text-[#003919]' : 'text-[#bccabb] hover:text-white'
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
              <GlassCard className="text-center p-3 h-[85%] flex flex-col justify-end border-slate-400/30">
                <div className="relative mx-auto mb-2 h-14 w-14 md:h-16 md:w-16 rounded-full border-2 border-slate-400 overflow-hidden">
                  <img src={top3[1].avatarUrl} alt={top3[1].name} className="h-full w-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 text-xs font-mono font-bold text-black">
                    2
                  </span>
                </div>
                <h3 className="truncate font-bold text-xs md:text-sm text-white">{top3[1].name}</h3>
                <p className="font-mono text-[10px] text-[#6bfb9a]">{top3[1].puneWard}</p>
                <div className="mt-1 font-mono text-xs font-black text-[#ffd23f]">{top3[1].ecoXP} XP</div>
              </GlassCard>

              {/* Rank 1 (Tallest) */}
              <GlassCard glow className="text-center p-4 h-full flex flex-col justify-end border-[#ffd23f]/50 bg-gradient-to-t from-[#ffd23f]/10 to-transparent">
                <div className="relative mx-auto mb-2 h-16 w-16 md:h-20 md:w-20 rounded-full border-4 border-[#ffd23f] overflow-hidden shadow-lg">
                  <img src={top3[0].avatarUrl} alt={top3[0].name} className="h-full w-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#ffd23f] text-xs font-mono font-bold text-[#003919]">
                    👑 1
                  </span>
                </div>
                <h3 className="truncate font-bold text-sm md:text-base text-white">{top3[0].name}</h3>
                <p className="font-mono text-xs text-[#6bfb9a]">{top3[0].puneWard}</p>
                <div className="mt-1 font-mono text-sm font-black text-[#ffd23f]">{top3[0].ecoXP} XP</div>
              </GlassCard>

              {/* Rank 3 */}
              <GlassCard className="text-center p-3 h-[75%] flex flex-col justify-end border-amber-700/30">
                <div className="relative mx-auto mb-2 h-14 w-14 md:h-16 md:w-16 rounded-full border-2 border-amber-700 overflow-hidden">
                  <img src={top3[2].avatarUrl} alt={top3[2].name} className="h-full w-full object-cover" />
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 text-xs font-mono font-bold text-white">
                    3
                  </span>
                </div>
                <h3 className="truncate font-bold text-xs md:text-sm text-white">{top3[2].name}</h3>
                <p className="font-mono text-[10px] text-[#6bfb9a]">{top3[2].puneWard}</p>
                <div className="mt-1 font-mono text-xs font-black text-[#ffd23f]">{top3[2].ecoXP} XP</div>
              </GlassCard>
            </div>
          )}

          {/* Full Ranked Table */}
          <GlassCard className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm text-[#e4e2de]">
              <thead className="border-b border-white/10 bg-white/5 font-mono text-xs uppercase text-[#bccabb]">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Eco Warrior</th>
                  <th className="py-3 px-4">Pune Ward</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4 text-right">EcoXP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map((entry) => (
                  <tr
                    key={entry.userId}
                    className={`transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-[#6bfb9a]/15 font-bold text-white border-l-4 border-l-[#6bfb9a]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#ffd23f]">#{entry.rank}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={entry.avatarUrl} alt={entry.name} className="h-8 w-8 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold">{entry.name} {entry.isCurrentUser && '(You)'}</div>
                          <div className="text-[11px] font-mono text-[#bccabb]">@{entry.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[#6bfb9a]">{entry.puneWard}</td>
                    <td className="py-3 px-4 font-mono text-xs">{entry.persona}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#ffd23f]">{entry.ecoXP} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>

        {/* Right Column: Social Achievement Share Card */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="font-headline-lg text-lg font-bold text-white">Your Social Achievement Card</h2>
          <ShareCardCanvas user={user} userRank={currentUserRank} />
        </div>
      </div>
    </div>
  );
}
