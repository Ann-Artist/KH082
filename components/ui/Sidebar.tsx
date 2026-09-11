import React from 'react';
import { UserProfile } from '../../types';

interface SidebarProps {
  currentPath: string;
  user: UserProfile;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, user, onNavigate }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Eco Quests', path: '/quests', icon: 'assignment' },
    { label: 'Pune Leaderboard', path: '/leaderboard', icon: 'leaderboard' },
    { label: 'CO₂ Impact', path: '/impact', icon: 'monitoring' },
    { label: 'Rewards', path: '/rewards', icon: 'workspace_premium' },
    { label: 'Profile & Lifestyle', path: '/profile', icon: 'tune' },
    { label: 'Admin Console', path: '/admin', icon: 'admin_panel_settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-white/5 bg-[#0f1613]/90 p-5 backdrop-blur-2xl md:flex">
      {/* Brand Logo */}
      <div 
        onClick={() => onNavigate('/')}
        className="mb-8 flex cursor-pointer items-center gap-3 px-2 transition-opacity hover:opacity-90"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6bfb9a]/15 text-[#6bfb9a] shadow-inner">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            spa
          </span>
        </div>
        <span className="font-headline-lg text-2xl font-extrabold tracking-tight text-white">
          Eco<span className="text-[#6bfb9a]">Quest</span>
        </span>
      </div>

      {/* User Badge Summary */}
      <div className="mb-6 rounded-xl border border-white/5 bg-[#131b16] p-3 text-left">
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-10 w-10 rounded-full border-2 border-[#6bfb9a]/50 object-cover"
          />
          <div className="overflow-hidden">
            <h3 className="truncate font-semibold text-white text-sm">{user.name}</h3>
            <p className="font-label-caps text-xs text-[#6bfb9a] font-mono">
              Lvl {user.level} • {user.persona}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-grow flex-col gap-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'border-l-4 border-[#6bfb9a] bg-gradient-to-r from-[#6bfb9a]/15 to-transparent text-[#6bfb9a] font-semibold'
                  : 'text-[#bccabb] hover:bg-white/5 hover:text-white'
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Pune Ward Chip */}
      <div className="mt-auto rounded-xl border border-[#6bfb9a]/20 bg-[#6bfb9a]/5 p-3 text-center">
        <span className="font-label-caps text-[11px] font-mono uppercase text-[#6bfb9a]">
          📍 {user.puneWard} Ward
        </span>
        <p className="mt-1 text-xs text-[#bccabb]">Eco Streak: <strong className="text-white">{user.streakDays} Days</strong> 🔥</p>
      </div>
    </aside>
  );
};
