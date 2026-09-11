'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AgeGroup } from '@/types';

interface AgeGroupPageProps {
  onNext?: (ageGroup: AgeGroup) => void;
}

export default function AgeGroupPage(props: any) {
  const router = useRouter();
  const [selected, setSelected] = useState<AgeGroup>('Gen Z / Young Adult');

  const options: { id: AgeGroup; title: string; desc: string; icon: string }[] = [
    { id: 'Child/Teen', title: '🌱 Kids / Teens', desc: 'Simpler achievement-oriented tasks & badge feedback.', icon: 'child_care' },
    { id: 'Gen Z / Young Adult', title: '⚡ Gen Z / Young Adults', desc: 'Competitive challenges, streaks, social leaderboards & sharing.', icon: 'bolt' },
    { id: 'Adult', title: '🌿 Adults', desc: 'Practical lifestyle, transportation & household energy reduction.', icon: 'home' },
    { id: 'Senior', title: '🌳 Seniors', desc: 'Waste segregation, tree care, energy conservation & community drives.', icon: 'park' },
  ];

  const handleContinue = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (typeof props?.onNext === 'function') {
      props.onNext(selected);
    } else {
      router.push('/onboarding/location');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="font-mono text-xs font-bold text-[#10b981]">STEP 1 OF 4 • ONBOARDING</span>
        <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Select Your Age Group Category</h2>
        <p className="text-xs text-gray-600 font-medium">Personalizes your UI presentation, quest complexity & recommended challenges.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`cursor-pointer rounded-2xl border p-4 transition-all ${
              selected === opt.id
                ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[#10b981]">{opt.icon}</span>
              <h3 className="font-bold text-gray-900 text-sm">{opt.title}</h3>
            </div>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed font-medium">{opt.desc}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        className="w-full rounded-2xl bg-[#111827] py-3.5 text-sm font-extrabold text-white hover:bg-black transition-all shadow-sm cursor-pointer"
      >
        Continue to Location Setup →
      </button>
    </div>
  );
}
