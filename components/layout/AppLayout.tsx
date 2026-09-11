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
    <div className="flex min-h-screen bg-gradient-to-br from-[#061910] via-[#0b271c] to-[#030d08] p-3 md:p-5 font-sans">
      {/* Sidebar Layout */}
      <Sidebar user={user} currentPath={pathname} />

      {/* Main Content Card Container */}
      <div className="flex flex-1 flex-col pl-64">
        <div className="flex flex-1 flex-col rounded-3xl bg-[#edf2ee] text-[#111827] shadow-2xl overflow-hidden border border-white/10 min-h-[calc(100vh-2.5rem)]">
          {/* Top Header Bar */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-[#edf2ee]/90 px-8 py-4 backdrop-blur-md">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {getSectionTitle(pathname)}
            </h1>

            <div className="flex items-center gap-3">
              {/* XP Badge */}
              <div className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1.5 font-mono text-xs font-extrabold text-amber-700 shadow-sm">
                <span className="material-symbols-outlined text-base text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                  stars
                </span>
                <span>{user.ecoXP || 0} XP</span>
              </div>

              {/* Streak Badge */}
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 font-mono text-xs font-extrabold text-emerald-700 shadow-sm">
                <span className="material-symbols-outlined text-base text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_fire_department
                </span>
                <span>{user.streakDays || 0} Day Streak</span>
              </div>

              {/* Notification Bell */}
              <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-lg">notifications</span>
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500"></span>
              </button>

              {/* Action Button */}
              <button
                onClick={() => {
                  if (pathname !== '/quests') window.location.href = '/quests';
                }}
                className="flex items-center gap-2 rounded-xl bg-[#111827] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-black transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Add Custom Widget</span>
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 px-8 py-6 overflow-y-auto">{children}</main>
        </div>
      </div>

      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setAiChatOpen(!aiChatOpen)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 rounded-full bg-[#111827] px-5 py-3 font-display-lg text-sm font-extrabold text-white shadow-2xl hover:bg-black transition-all border border-emerald-500/30"
      >
        <span className="material-symbols-outlined text-xl text-[#10b981]">smart_toy</span>
        <span>🤖 AI Eco Assistant</span>
      </button>

      {/* Floating AI Chat Window */}
      {aiChatOpen && (
        <div className="fixed bottom-24 right-8 z-50 flex h-[480px] w-96 flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 bg-[#0e1411] px-5 py-3.5 text-white">
            <div className="flex items-center gap-2 text-[#10b981]">
              <span className="material-symbols-outlined text-xl">smart_toy</span>
              <span className="font-headline-lg text-sm font-bold text-white">EcoQuest AI Assistant</span>
            </div>
            <button onClick={() => setAiChatOpen(false)} className="text-gray-400 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs bg-gray-50">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-[#10b981] text-white font-semibold'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="flex gap-2 border-t border-gray-200 bg-white p-3">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask about Pune metro, waste rules..."
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs text-gray-900 focus:border-[#10b981] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#111827] px-4 py-2 text-xs font-bold text-white hover:bg-black transition-colors"
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
