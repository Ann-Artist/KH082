'use client';

import React, { useState } from 'react';
import { PuneWard } from '@/types';

interface LocationPageProps {
  onNext: (ward: PuneWard) => void;
}

export const LocationPage: React.FC<LocationPageProps> = ({ onNext }) => {
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

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="font-mono text-xs font-bold text-[#6bfb9a]">STEP 2 OF 4 • LOCATION SETUP</span>
        <h2 className="font-headline-lg text-2xl font-bold text-white mt-1">Select Your Pune Locality / Ward</h2>
        <p className="text-xs text-[#bccabb]">Enables location-aware quests, Pune Metro routes, and Ward leaderboards.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
        <label className="block text-xs font-mono text-[#bccabb] mb-2">City & Region</label>
        <input
          type="text"
          value="Pune, Maharashtra, India 📍"
          disabled
          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-[#6bfb9a] font-mono font-bold"
        />

        <label className="block text-xs font-mono text-[#bccabb] mt-4 mb-2">Pune Ward / Neighborhood</label>
        <select
          value={ward}
          onChange={(e) => setWard(e.target.value as PuneWard)}
          className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
        >
          {wards.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => onNext(ward)}
        className="w-full rounded-2xl bg-[#6bfb9a] py-3 text-sm font-bold text-[#003919] hover:bg-[#59e68a] transition-all"
      >
        Continue to Lifestyle Survey →
      </button>
    </div>
  );
};

export default LocationPage;
