'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PuneWard } from '@/types';

interface LocationPageProps {
  onNext?: (ward: PuneWard) => void;
}

export default function LocationPage(props: any) {
  const router = useRouter();
  const [ward, setWard] = useState<PuneWard>('Kothrud');

  const wards: PuneWard[] = [
    'Kothrud',
    'Viman Nagar',
    'Baner / Balewadi',
    'Deccan Gymkhana',
    'Hinjewadi',
    'Hadapsar',
    'Camp / Koregaon Park',
    'Pimpri-Chinchwad (PCMC)',
    'Shivajinagar',
    'Aundh',
  ];

  const handleContinue = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (typeof props?.onNext === 'function') {
      props.onNext(ward);
    } else {
      router.push('/onboarding/lifestyle');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="font-mono text-xs font-bold text-[#10b981]">STEP 2 OF 4 • LOCATION SETUP</span>
        <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Select Your Pune Locality / Ward</h2>
        <p className="text-xs text-gray-600 font-medium">Enables location-aware quests, Pune Metro routes, and Ward leaderboards.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <label className="block text-xs font-mono font-bold text-gray-700 mb-2">City & Region</label>
        <input
          type="text"
          value="Pune, Maharashtra, India 📍"
          disabled
          className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-emerald-700 font-mono font-bold"
        />

        <label className="block text-xs font-mono font-bold text-gray-700 mt-4 mb-2">Pune Ward / Neighborhood</label>
        <select
          value={ward}
          onChange={(e) => setWard(e.target.value as PuneWard)}
          className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm font-semibold text-gray-900 focus:border-[#10b981] focus:outline-none"
        >
          {wards.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        className="w-full rounded-2xl bg-[#111827] py-3.5 text-sm font-extrabold text-white hover:bg-black transition-all shadow-sm cursor-pointer"
      >
        Continue to Lifestyle Survey →
      </button>
    </div>
  );
}
