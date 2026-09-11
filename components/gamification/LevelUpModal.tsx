import React from 'react';
import { GreenPersonaTitle } from '../../types';

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  levelTitle: GreenPersonaTitle;
  xpEarned: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  newLevel,
  levelTitle,
  xpEarned,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-lg">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#ffd23f]/50 bg-[#121c16] p-8 text-center shadow-[0_0_50px_rgba(255,210,63,0.3)]">
        {/* Glow Aura */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ffd23f]/20 blur-3xl" />

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#ffd23f] bg-[#ffd23f]/20 text-[#ffd23f] shadow-lg animate-bounce">
          <span className="material-symbols-outlined text-4xl">emoji_events</span>
        </div>

        <span className="mt-4 inline-block font-mono text-xs font-bold uppercase text-[#ffd23f] tracking-widest">
          🎉 LEVEL UP UNLOCKED!
        </span>

        <h2 className="font-display-lg text-3xl font-extrabold text-white mt-1">
          Level {newLevel}: <span className="text-[#6bfb9a]">{levelTitle}</span>
        </h2>

        <p className="mt-2 text-sm text-[#bccabb]">
          You just earned <strong className="text-[#ffd23f]">+{xpEarned} EcoXP</strong>! You have reached a higher sustainability rank in Pune.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs font-mono text-[#6bfb9a]">
          ✨ New Quests, Higher Difficulty Tiers & Achievement Badges Unlocked!
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#6bfb9a] to-[#ffd23f] py-3.5 font-extrabold text-[#003919] shadow-lg hover:brightness-110 transition-all"
        >
          Continue Eco Quest
        </button>
      </div>
    </div>
  );
};
