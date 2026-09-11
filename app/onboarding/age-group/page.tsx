'use client';

import React, { useState } from 'react';
import { AgeGroup } from '@/types';

interface AgeGroupPageProps {
  onNext: (ageGroup: AgeGroup) => void;
}

export const AgeGroupPage: React.FC<AgeGroupPageProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<AgeGroup>('Gen Z / Young Adult');

  const options: { id: AgeGroup; title: string; desc: string; icon: string }[] = [
    { id: 'Child/Teen', title: '🌱 Kids / Teens', desc: 'Simpler achievement-oriented tasks & badge feedback.', icon: 'child_care' },
    { id: 'Gen Z / Young Adult', title: '⚡ Gen Z / Young Adults', desc: 'Competitive challenges, streaks, social leaderboards & sharing.', icon: 'bolt' },
    { id: 'Adult', title: '🌿 Adults', desc: 'Practical lifestyle, transportation & household energy reduction.', icon: 'home' },
    { id: 'Senior', title: '🌳 Seniors', desc: 'Waste segregation, tree care, energy conservation & community drives.', icon: 'park' },
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="font-mono text-xs font-bold text-[#6bfb9a]">STEP 1 OF 4 • ONBOARDING</span>
        <h2 className="font-headline-lg text-2xl font-bold text-white mt-1">Select Your Age Group Category</h2>
        <p className="text-xs text-[#bccabb]">Personalizes your UI presentation, quest complexity & recommended challenges.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`cursor-pointer rounded-2xl border p-4 transition-all ${
              selected === opt.id
                ? 'border-[#6bfb9a] bg-[#6bfb9a]/20 text-[#6bfb9a] shadow-[0_0_20px_rgba(107,251,154,0.15)]'
                : 'border-white/10 bg-black/40 text-[#bccabb] hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl">{opt.icon}</span>
              <h3 className="font-title-md font-bold text-white text-sm">{opt.title}</h3>
            </div>
            <p className="mt-2 text-xs text-[#bccabb] leading-relaxed">{opt.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => onNext(selected)}
        className="w-full rounded-2xl bg-[#6bfb9a] py-3 text-sm font-bold text-[#003919] hover:bg-[#59e68a] transition-all"
      >
        Continue to Location Setup →
      </button>
    </div>
  );
};

export default AgeGroupPage;
