import React from 'react';
import { UserProfile } from '../../types';

interface NavbarProps {
  user: UserProfile;
  onNavigate: (path: string) => void;
  onResetDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, onResetDemo }) => {
  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-white/5 bg-[#0b110e]/80 px-4 py-3 backdrop-blur-xl md:px-8">
      {/* Mobile Brand Title */}
      <div 
        onClick={() => onNavigate('/')} 
        className="flex cursor-pointer items-center gap-2 md:hidden"
      >
        <span className="material-symbols-outlined text-2xl text-[#6bfb9a]" style={{ fontVariationSettings: "'FILL' 1" }}>
          spa
        </span>
        <span className="font-headline-lg font-bold text-white text-lg">Eco<span className="text-[#6bfb9a]">Quest</span></span>
      </div>

      {/* Breadcrumb / Title */}
      <div className="hidden items-center gap-2 text-sm text-[#bccabb] md:flex font-mono">
        <span>Pune, MH</span>
        <span>/</span>
        <span className="text-[#6bfb9a] font-semibold">{user.puneWard} Ward</span>
      </div>

      {/* User Actions & XP Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[#ffd23f]/30 bg-[#ffd23f]/10 px-3 py-1 text-xs font-mono font-bold text-[#ffd23f]">
          <span className="material-symbols-outlined text-base">stars</span>
          <span>{user.ecoXP} XP</span>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#6bfb9a]/30 bg-[#6bfb9a]/10 px-3 py-1 text-xs font-mono font-bold text-[#6bfb9a]">
          <span>🔥 {user.streakDays} Day Streak</span>
        </div>

        {onResetDemo && (
          <button
            onClick={onResetDemo}
            title="Reset Demo Data"
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[#bccabb] hover:bg-white/10 hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        <img
          src={user.avatarUrl}
          alt={user.name}
          onClick={() => onNavigate('/profile')}
          className="h-9 w-9 cursor-pointer rounded-full border-2 border-[#6bfb9a] object-cover transition-transform hover:scale-105"
        />
      </div>
    </header>
  );
};
