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

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'grid_view' },
    { path: '/quests', label: 'Eco Quests', icon: 'assignment' },
    { path: '/progress', label: 'Eco Journey', icon: 'call_split' },
    { path: '/badges', label: 'Badges', icon: 'military_tech' },
    { path: '/leaderboard', label: 'Pune Leaderboard', icon: 'bar_chart' },
    { path: '/impact', label: 'CO₂ Impact', icon: 'show_chart' },
    { path: '/rewards', label: 'Rewards', icon: 'workspace_premium', badge: '1' },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#0e1411] border-r border-white/5 p-4 text-white">
      {/* Brand Header */}
      <div
        onClick={() => handleNav('/dashboard')}
        className="flex cursor-pointer items-center gap-2.5 px-2 py-2 mb-3"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#10b981] text-[#0e1411]">
          <span className="material-symbols-outlined text-lg font-extrabold">spa</span>
        </div>
        <span className="text-xl font-extrabold tracking-tight text-white">
          Eco<span className="text-[#10b981]">Quest</span>
        </span>
      </div>

      {/* Workspace Selector Card */}
      <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-2.5 transition-colors hover:border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#10b981]/30 to-[#34d399]/30 text-[#10b981] border border-[#10b981]/40">
              <span className="material-symbols-outlined text-base">eco</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Team Workspace</p>
              <h4 className="truncate text-xs font-bold text-white">{user.puneWard || 'Kothrud'} Zone</h4>
            </div>
          </div>
          <span className="material-symbols-outlined text-base text-gray-400">unfold_more</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-400 transition-colors focus-within:border-[#10b981]/50 focus-within:text-white">
        <div className="flex items-center gap-2 flex-1">
          <span className="material-symbols-outlined text-base text-gray-400">search</span>
          <input
            type="text"
            placeholder="Search for..."
            className="w-full bg-transparent text-xs text-white placeholder-gray-400 outline-none"
          />
        </div>
        <kbd className="rounded border border-white/10 bg-black/40 px-1.5 py-0.5 text-[10px] font-mono text-gray-400">
          ⌘+F
        </kbd>
      </div>

      {/* Navigation Section */}
      <div className="px-2 mb-1">
        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">NAVIGATION</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined text-lg ${isActive ? 'text-[#10b981]' : 'text-gray-400'}`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10b981] text-[10px] font-bold text-[#0e1411]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* User Account / Settings Section */}
        <div className="pt-3 px-2 mb-1">
          <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">USER ACCOUNT</span>
        </div>

        <button
          onClick={() => handleNav('/profile')}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
            activePath === '/profile'
              ? 'bg-white/10 text-white font-bold border border-white/15'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-lg text-gray-400">settings</span>
          <span>Settings</span>
        </button>

        <button
          onClick={handleLogoutClick}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Log Out</span>
        </button>
      </nav>

      {/* User Account Profile Card Footer */}
      <div className="mt-auto pt-3 border-t border-white/10">
        <div
          onClick={() => handleNav('/profile')}
          className="flex cursor-pointer items-center justify-between rounded-xl bg-white/5 p-2.5 transition-colors hover:bg-white/10"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#10b981]">
              <img
                src={user.avatarUrl || 'avatars/verda.png'}
                alt={user.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-xs font-bold text-white">{user.name || 'Alex Williamson'}</h4>
              <p className="truncate text-[10px] font-mono text-gray-400">Lvl {user.level} • {user.ecoXP} XP</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-base text-gray-400">more_vert</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
