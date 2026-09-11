'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { UserProfile } from '@/types';
import { getStoredUserProfile } from '@/lib/storage';

interface AppLayoutProps {
  children: React.ReactNode;
  user?: UserProfile;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, user: propUser }) => {
  const pathname = usePathname();
  const user = propUser || getStoredUserProfile();
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello ${user.name || 'Citizen'}! I am your Pune Eco AI Assistant. Ask me about PMPML bus routes, MahaMetro stations, waste segregation rules, or dietary carbon reduction tips!`,
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Public/Auth routes should NOT show the sidebar layout shell
  const isPublicRoute =
    pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/onboarding';

  if (isPublicRoute) {
    return <>{children}</>;
  }

  const getSectionTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'DASHBOARD';
      case '/quests':
        return 'ECO QUESTS';
      case '/progress':
        return 'ECO JOURNEY';
      case '/badges':
        return 'BADGES';
      case '/leaderboard':
        return 'PUNE LEADERBOARD';
      case '/impact':
        return 'CO₂ IMPACT';
      case '/rewards':
        return 'REWARDS';
      case '/profile':
        return 'PROFILE SETTINGS';
      case '/admin':
        return 'PMC ADMIN CONSOLE';
      default:
        return 'ECOQUEST';
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');

    setTimeout(() => {
      let reply = `Great question about Pune sustainability! Actionable tip: Switching 2 trips per week to Metro or PMPML saves ~15 kg CO₂ monthly!`;
      if (userText.toLowerCase().includes('metro') || userText.toLowerCase().includes('pmpml')) {
        reply = `🚌 MahaMetro & PMPML Route Info: Pune Metro Line 1 (PCMC to Swargate) & Line 2 (Vanaz to Ramwadi) reduce transit emissions by 75% compared to private vehicles!`;
      } else if (userText.toLowerCase().includes('waste') || userText.toLowerCase().includes('plastic')) {
        reply = `♻️ Pune Waste Segregation Rule: PMC collects segregated Wet (Organic/Green bin) and Dry (Recyclable/Blue bin) waste. Composting wet waste earns +40 EcoXP!`;
      } else if (userText.toLowerCase().includes('diet') || userText.toLowerCase().includes('food')) {
        reply = `🥗 Dietary Tip: Choosing locally-sourced vegetarian meals across Pune wards saves up to 45 kg CO₂e per month!`;
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-[#0b110e] text-[#e4e2de]">
      {/* Sidebar Layout */}
      <Sidebar user={user} currentPath={pathname} />

      {/* Main Container */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0b110e]/90 px-8 py-4 backdrop-blur-xl">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#bccabb]">
            {getSectionTitle(pathname)}
          </div>

          <div className="flex items-center gap-3">
            {/* XP Badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-[#ffd23f]/30 bg-[#ffd23f]/10 px-3.5 py-1.5 font-mono text-xs font-extrabold text-[#ffd23f]">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
              <span>{user.ecoXP || 0} XP</span>
            </div>

            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-[#6bfb9a]/30 bg-[#6bfb9a]/10 px-3.5 py-1.5 font-mono text-xs font-extrabold text-[#6bfb9a]">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <span>{user.streakDays || 0} Day Streak</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-8 py-6">{children}</main>
      </div>

      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setAiChatOpen(!aiChatOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#6bfb9a] via-[#4ade80] to-[#ffd23f] px-5 py-3 font-display-lg text-sm font-black text-[#003919] shadow-[0_0_25px_rgba(107,251,154,0.4)] hover:scale-105 transition-all"
      >
        <span className="material-symbols-outlined text-xl">smart_toy</span>
        <span>🤖 AI Eco Assistant</span>
      </button>

      {/* Floating AI Chat Window */}
      {aiChatOpen && (
        <div className="fixed bottom-20 right-6 z-50 flex h-[480px] w-96 flex-col overflow-hidden rounded-3xl border border-[#6bfb9a]/30 bg-[#121b16] shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3.5">
            <div className="flex items-center gap-2 text-[#6bfb9a]">
              <span className="material-symbols-outlined text-xl">smart_toy</span>
              <span className="font-headline-lg text-sm font-bold text-white">EcoQuest AI Assistant</span>
            </div>
            <button onClick={() => setAiChatOpen(false)} className="text-[#bccabb] hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-[#6bfb9a] text-[#003919] font-semibold'
                    : 'bg-white/5 border border-white/10 text-[#e4e2de]'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="flex gap-2 border-t border-white/10 p-3">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask about Pune metro, waste rules..."
              className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white focus:border-[#6bfb9a] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#6bfb9a] px-4 py-2 text-xs font-bold text-[#003919] hover:bg-[#59e68a]"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
