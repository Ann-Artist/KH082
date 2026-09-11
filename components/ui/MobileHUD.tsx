import React from 'react';

interface MobileHUDProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileHUD: React.FC<MobileHUDProps> = ({ currentPath, onNavigate }) => {
  const items = [
    { label: 'Dash', path: '/dashboard', icon: 'dashboard' },
    { label: 'Quests', path: '/quests', icon: 'assignment' },
    { label: 'Ranks', path: '/leaderboard', icon: 'leaderboard' },
    { label: 'Impact', path: '/impact', icon: 'monitoring' },
    { label: 'Profile', path: '/profile', icon: 'person' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/10 bg-[#0b110e]/95 px-2 py-2 backdrop-blur-2xl md:hidden">
      {items.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-all ${
              isActive ? 'text-[#6bfb9a] font-bold' : 'text-[#bccabb]'
            }`}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
