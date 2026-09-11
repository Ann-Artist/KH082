'use client';

import React, { useRef, useState } from 'react';
import { UserProfile } from '../../types';

interface ShareCardCanvasProps {
  user: UserProfile;
  userRank: number;
}

export const ShareCardCanvas: React.FC<ShareCardCanvasProps> = ({ user, userRank }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyShare = () => {
    const text = `🌱 EcoQuest Achievement Unlocked!\n👤 ${user.name} (@${user.username})\n🏆 Level ${user.level} - ${user.persona}\n⭐ EcoXP: ${user.ecoXP} XP\n🔥 Streak: ${user.streakDays} Days\n📍 Pune Rank: #${userRank} (${user.puneWard})\n🌍 Estimated CO₂ Avoided: ${user.totalCO2AvoidedKg} kg\nJoin EcoQuest Pune: Measure. Play. Compete. Reduce.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#6bfb9a]/40 bg-gradient-to-b from-[#0b110e] via-[#121c16] to-[#062c1d] p-6 shadow-2xl">
      {/* Background Graphic */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#6bfb9a]/15 blur-3xl" />

      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl text-[#6bfb9a]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          <span className="font-display-lg text-xl font-bold text-white">Eco<span className="text-[#6bfb9a]">Quest</span></span>
        </div>
        <span className="rounded-full border border-[#6bfb9a]/30 bg-[#6bfb9a]/10 px-3 py-1 font-mono text-xs font-bold text-[#6bfb9a]">
          Pune Wall of Champions
        </span>
      </div>

      {/* Card Main Body */}
      <div className="mt-6 text-center">
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="mx-auto h-20 w-20 rounded-full border-4 border-[#6bfb9a] object-cover shadow-xl"
        />
        <h3 className="mt-3 font-display-lg text-2xl font-black text-white">{user.name}</h3>
        <p className="font-mono text-xs text-[#6bfb9a]">@{user.username} • {user.puneWard} Ward</p>

        <div className="mt-4 inline-block rounded-2xl border border-[#ffd23f]/40 bg-[#ffd23f]/10 px-4 py-1.5 font-mono text-sm font-extrabold text-[#ffd23f]">
          🎖️ Level {user.level} {user.persona}
        </div>
      </div>

      {/* Grid Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 text-center font-mono">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="text-xl font-black text-white">{user.ecoXP}</div>
          <div className="text-[10px] text-[#bccabb] uppercase">Total EcoXP</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="text-xl font-black text-[#ffd23f]">#{userRank}</div>
          <div className="text-[10px] text-[#bccabb] uppercase">Pune Rank</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="text-xl font-black text-[#6bfb9a]">🔥 {user.streakDays}d</div>
          <div className="text-[10px] text-[#bccabb] uppercase">Active Streak</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="text-xl font-black text-emerald-400">{user.totalCO2AvoidedKg}kg</div>
          <div className="text-[10px] text-[#bccabb] uppercase">CO₂ Avoided</div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleCopyShare}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#6bfb9a]/40 bg-[#6bfb9a] py-3 text-xs font-bold text-[#003919] hover:bg-[#58e388] transition-all"
        >
          <span className="material-symbols-outlined text-base">share</span>
          <span>{copied ? 'Copied Achievement Card to Clipboard!' : 'Share Achievement Card'}</span>
        </button>
      </div>
    </div>
  );
};
