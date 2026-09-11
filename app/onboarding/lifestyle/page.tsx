'use client';

import React, { useState } from 'react';
import { LifestyleInputs } from '@/types';

interface LifestylePageProps {
  initialInputs: LifestyleInputs;
  onNext: (inputs: LifestyleInputs) => void;
}

export default function LifestylePage(props: any) {
  const initialInputs: LifestyleInputs = props?.initialInputs || { carKmPerWeek: 40, bikeKmPerWeek: 20, monthlyKwh: 140, dietType: 'vegetarian', shoppingItemsPerMonth: 4, recyclingSegregated: true };
  const onNext = props?.onNext || (() => {});
  const [inputs, setInputs] = useState<LifestyleInputs>(initialInputs);

  return (
    <div className="space-y-6 text-left">
      <div>
        <span className="font-mono text-xs font-bold text-[#10b981]">STEP 3 OF 4 • LIFESTYLE SURVEY</span>
        <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Lifestyle Assessment</h2>
        <p className="text-xs text-gray-600 font-medium">Inputs across Transportation, Electricity, Food, Shopping, and Waste.</p>
      </div>

      <div className="space-y-4">
        {/* Transportation */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[#10b981]">directions_car</span>
            1. Transportation Habits
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold text-gray-700">Car Km / week</label>
              <input
                type="number"
                value={inputs.carKmPerWeek}
                onChange={(e) => setInputs({ ...inputs, carKmPerWeek: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 bg-white p-2 text-xs font-semibold text-gray-900 focus:border-[#10b981] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-bold text-gray-700">Bike Km / week</label>
              <input
                type="number"
                value={inputs.bikeKmPerWeek}
                onChange={(e) => setInputs({ ...inputs, bikeKmPerWeek: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 bg-white p-2 text-xs font-semibold text-gray-900 focus:border-[#10b981] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Electricity */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">bolt</span>
            2. Electricity & Energy
          </h3>

          <div>
            <label className="block text-[11px] font-mono font-bold text-gray-700">Monthly Electricity (kWh)</label>
            <input
              type="number"
              value={inputs.monthlyKwh}
              onChange={(e) => setInputs({ ...inputs, monthlyKwh: Number(e.target.value) })}
              className="w-full rounded-xl border border-gray-200 bg-white p-2 text-xs font-semibold text-gray-900 focus:border-[#10b981] focus:outline-none"
            />
          </div>
        </div>

        {/* Food */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[#10b981]">restaurant</span>
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
                className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all ${
                  inputs.dietType === diet.id ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
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
        className="w-full rounded-2xl bg-[#111827] py-3 text-sm font-extrabold text-white hover:bg-black transition-all shadow-sm"
      >
        Run Carbon Engine Calculation →
      </button>
    </div>
  );
}
