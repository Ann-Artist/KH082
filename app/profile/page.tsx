'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, LifestyleInputs, PuneWard } from '@/types';
import { getStoredLifestyleInputs, saveLifestyleInputs, getStoredUserProfile, saveUserProfile } from '../../lib/storage';
import { GlassCard } from '../../components/ui/GlassCard';

interface ProfilePageProps {
  user?: UserProfile;
  onUpdateState?: (user: UserProfile) => void;
  onNavigate?: (path: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user: propUser, onUpdateState, onNavigate }) => {
  const router = useRouter();
  const [userState, setUserState] = useState<UserProfile>(() => propUser || getStoredUserProfile());
  const user = propUser || userState;

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [ward, setWard] = useState<PuneWard>(user.puneWard);
  const [inputs, setInputs] = useState<LifestyleInputs>(getStoredLifestyleInputs());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    // Recalculate carbon footprint and update persona!
    const { result, profile: updatedProfile } = saveLifestyleInputs(inputs);

    const finalProfile: UserProfile = {
      ...updatedProfile,
      name,
      username,
      puneWard: ward,
    };

    saveUserProfile(finalProfile);
    setUserState(finalProfile);
    if (typeof onUpdateState === 'function') {
      onUpdateState(finalProfile);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      <div>
        <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-white">Profile & Lifestyle Settings</h1>
        <p className="text-xs text-[#bccabb]">Update your Pune profile, lifestyle parameters & recalculate footprint.</p>
      </div>

      {savedSuccess && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-xs font-bold text-emerald-300 flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          <span>Profile & Lifestyle updated! Carbon footprint recalculated and AI recommendations refreshed.</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Basic Information */}
        <GlassCard className="space-y-4">
          <h2 className="font-headline-lg text-lg font-bold text-white">Basic Eco Profile</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-mono text-[#bccabb] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#bccabb] mb-1">Username (@)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#bccabb] mb-1">Pune Ward / Area</label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value as PuneWard)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
              >
                <option value="Kothrud">Kothrud</option>
                <option value="Viman Nagar">Viman Nagar</option>
                <option value="Baner / Balewadi">Baner / Balewadi</option>
                <option value="Deccan Gymkhana">Deccan Gymkhana</option>
                <option value="Hinjewadi">Hinjewadi</option>
                <option value="Hadapsar">Hadapsar</option>
                <option value="Camp / Koregaon Park">Camp / Koregaon Park</option>
                <option value="Pimpri-Chinchwad (PCMC)">Pimpri-Chinchwad (PCMC)</option>
                <option value="Shivajinagar">Shivajinagar</option>
                <option value="Aundh">Aundh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#bccabb] mb-1">Age Group</label>
              <input
                type="text"
                value={user.ageGroup}
                disabled
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-[#bccabb] cursor-not-allowed"
              />
            </div>
          </div>
        </GlassCard>

        {/* Lifestyle Inputs Recalculation */}
        <GlassCard className="space-y-4">
          <h2 className="font-headline-lg text-lg font-bold text-white">Lifestyle Change & Recalculation</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-mono text-[#bccabb] mb-1">Car Km / Week</label>
              <input
                type="number"
                value={inputs.carKmPerWeek}
                onChange={(e) => setInputs({ ...inputs, carKmPerWeek: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#bccabb] mb-1">Bike Km / Week</label>
              <input
                type="number"
                value={inputs.bikeKmPerWeek}
                onChange={(e) => setInputs({ ...inputs, bikeKmPerWeek: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#bccabb] mb-1">Monthly Electricity (kWh)</label>
              <input
                type="number"
                value={inputs.monthlyKwh}
                onChange={(e) => setInputs({ ...inputs, monthlyKwh: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#bccabb] mb-1">Dietary Pattern</label>
              <select
                value={inputs.dietType}
                onChange={(e) => setInputs({ ...inputs, dietType: e.target.value as any })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
              >
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="balanced">Balanced</option>
                <option value="meat_heavy">Meat Heavy</option>
              </select>
            </div>
          </div>
        </GlassCard>

        <button
          type="submit"
          className="rounded-2xl border border-[#6bfb9a]/40 bg-[#6bfb9a] px-8 py-3.5 text-sm font-extrabold text-[#003919] hover:bg-[#59e68a] transition-all shadow-lg"
        >
          Recalculate Carbon Footprint & Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
