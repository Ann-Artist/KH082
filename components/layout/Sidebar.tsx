'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserProfile } from '@/types';
import { getStoredUserProfile } from '@/lib/storage';
import { logoutDatabaseUser } from '@/lib/supabase/auth';

interface SidebarProps {
  user?: UserProfile;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user: propUser,
  currentPath: propPath,
  onNavigate,
  onLogout,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const user = propUser || getStoredUserProfile();
  const activePath = propPath || pathname || '/dashboard';

  const handleNav = (path: string) => {
    if (typeof onNavigate === 'function') {
      onNavigate(path);
    } else {
      router.push(path);
    }
  };

  const handleLogoutClick = () => {
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      logoutDatabaseUser?.();
      router.push('/login');
    }
  };

  // Next XP Target Calculation
  const nextTargetXP = user.level * 150;
  const prevLevelXP = (user.level - 1) * 150;
  const levelProgress = Math.min(
    100,
    Math.max(0, Math.round(((user.ecoXP - prevLevelXP) / (nextTargetXP - prevLevelXP || 150)) * 100))
  );

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'grid_view' },
    { path: '/quests', label: 'Eco Quests', icon: 'assignment' },
    { path: '/progress', label: 'Eco Journey', icon: 'call_split' },
    { path: '/badges', label: 'Badges', icon: 'military_tech' },
    { path: '/leaderboard', label: 'Pune Leaderboard', icon: 'bar_chart' },
    { path: '/impact', label: 'CO₂ Impact', icon: 'show_chart' },
    { path: '/rewards', label: 'Rewards', icon: 'workspace_premium' },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[#6bfb9a]/15 bg-[#0b110e] p-5 text-white">
      {/* Brand Header */}
      <div
        onClick={() => handleNav('/dashboard')}
        className="flex cursor-pointer items-center gap-3 mb-6 px-1"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6bfb9a]/15 text-[#6bfb9a] shadow-[0_0_15px_rgba(107,251,154,0.2)]">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            spa
          </span>
        </div>
        <span className="font-display-lg text-2xl font-black tracking-tight text-white">
          Eco<span className="text-[#6bfb9a]">Quest</span>
        </span>
      </div>

      {/* User Profile Card */}
      <div
        onClick={() => handleNav('/profile')}
        className={`group relative mb-6 cursor-pointer overflow-hidden rounded-2xl border p-3.5 transition-all ${
          activePath === '/profile'
            ? 'border-[#6bfb9a] bg-[#6bfb9a]/15 shadow-[0_0_20px_rgba(107,251,154,0.15)]'
            : 'border-[#6bfb9a]/20 bg-[#121b16]/80 hover:border-[#6bfb9a]/40 hover:bg-[#121b16]'
        }`}
        title="Click to view & edit profile settings"
      >
        <div className="flex items-center gap-3 mb-2.5">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#6bfb9a] shadow-md">
            <img
              src={user.avatarUrl || 'avatars/verda.png'}
              alt={user.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-bold text-sm text-white group-hover:text-[#6bfb9a] transition-colors">
              {user.name}
            </h4>
            <p className="truncate font-mono text-[11px] text-[#6bfb9a]">
              Lvl {user.level} • {user.levelTitle || user.persona || 'Eco Seedling'}
            </p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-[10px] text-[#bccabb]">
            <span>{user.ecoXP} XP</span>
            <span>{nextTargetXP} XP Target</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6bfb9a] to-[#4ade80] transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? 'border border-[#6bfb9a]/60 bg-[#6bfb9a]/10 text-[#6bfb9a] shadow-[0_0_15px_rgba(107,251,154,0.15)] font-bold'
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

      {/* Footer Info & Logout */}
      <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between px-2 font-mono text-xs text-[#6bfb9a]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">location_on</span>
            {user.puneWard || 'Kothrud'}
          </span>
          <span className="text-[10px] text-[#bccabb]">Pune</span>
        </div>

        <button
          onClick={handleLogoutClick}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
