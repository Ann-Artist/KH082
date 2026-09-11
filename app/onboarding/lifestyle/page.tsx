'use client';

import React, { useState } from 'react';
import { LifestyleInputs } from '@/types';

interface LifestylePageProps {
  initialInputs: LifestyleInputs;
  onNext: (inputs: LifestyleInputs) => void;
}

export const LifestylePage: React.FC<LifestylePageProps> = ({ initialInputs, onNext }) => {
  const [inputs, setInputs] = useState<LifestyleInputs>(initialInputs);

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="font-mono text-xs font-bold text-[#6bfb9a]">STEP 3 OF 4 • LIFESTYLE SURVEY</span>
        <h2 className="font-headline-lg text-2xl font-bold text-white mt-1">Lifestyle Assessment</h2>
        <p className="text-xs text-[#bccabb]">Inputs across Transportation, Electricity, Food, Shopping, and Waste.</p>
      </div>

      <div className="space-y-4">
        {/* Transportation */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
          <h3 className="font-title-md font-bold text-white text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6bfb9a]">directions_car</span>
            1. Transportation Habits
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#bccabb]">Car Km / week</label>
              <input
                type="number"
                value={inputs.carKmPerWeek}
                onChange={(e) => setInputs({ ...inputs, carKmPerWeek: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-black/60 p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#bccabb]">Bike Km / week</label>
              <input
                type="number"
                value={inputs.bikeKmPerWeek}
                onChange={(e) => setInputs({ ...inputs, bikeKmPerWeek: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-black/60 p-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Electricity */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
          <h3 className="font-title-md font-bold text-white text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffd23f]">bolt</span>
            2. Electricity & Energy
          </h3>

          <div>
            <label className="block text-[11px] font-mono text-[#bccabb]">Monthly Electricity (kWh)</label>
            <input
              type="number"
              value={inputs.monthlyKwh}
              onChange={(e) => setInputs({ ...inputs, monthlyKwh: Number(e.target.value) })}
              className="w-full rounded-xl border border-white/10 bg-black/60 p-2 text-xs text-white"
            />
          </div>
        </div>

        {/* Food */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
          <h3 className="font-title-md font-bold text-white text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6bfb9a]">restaurant</span>
            3. Food & Dietary Pattern
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'vegan', label: '🌱 Vegan' },
              { id: 'vegetarian', label: '🥗 Vegetarian' },
              { id: 'balanced', label: '🍱 Balanced' },
              { id: 'meat_heavy', label: '🍖 Meat Heavy' },
            ].map((diet) => (
              <button
                key={diet.id}
                type="button"
                onClick={() => setInputs({ ...inputs, dietType: diet.id as any })}
                className={`rounded-xl border p-2 text-center text-xs font-semibold ${
                  inputs.dietType === diet.id ? 'border-[#6bfb9a] bg-[#6bfb9a]/20 text-[#6bfb9a]' : 'border-white/10 bg-black/60 text-[#bccabb]'
                }`}
              >
                {diet.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onNext(inputs)}
        className="w-full rounded-2xl bg-[#6bfb9a] py-3 text-sm font-bold text-[#003919] hover:bg-[#59e68a] transition-all"
      >
        Run Carbon Engine Calculation →
      </button>
    </div>
  );
};

export default LifestylePage;
