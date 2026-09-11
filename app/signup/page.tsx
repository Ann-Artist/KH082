'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerDatabaseUser } from '../../lib/supabase/auth';
import { PuneWard, AgeGroup } from '@/types';

export default function SignupPage(props: any) {
  const onNavigate = props?.onNavigate;
  const onUserSignupSuccess = props?.onUserSignupSuccess;
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ward, setWard] = useState<PuneWard>('Kothrud');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('Gen Z / Young Adult');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    // Register user account into database table
    const result = registerDatabaseUser(name, email, password, ward, ageGroup);

    if (result.success) {
      if (typeof onUserSignupSuccess === 'function') {
        onUserSignupSuccess();
      }
      if (typeof onNavigate === 'function') {
        onNavigate('/onboarding');
      } else {
        router.push('/onboarding');
      }
    } else {
      setErrorMsg(result.error || 'Registration failed.');
    }
  };

  const handleNavToLogin = () => {
    if (typeof onNavigate === 'function') {
      onNavigate('/login');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b110e] px-4 py-12 text-white">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#6bfb9a]/15 blur-3xl" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#6bfb9a]/20 bg-[#121b16]/90 p-8 backdrop-blur-2xl shadow-2xl text-left">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6bfb9a]/15 text-[#6bfb9a]">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          </div>
          <h2 className="mt-3 font-display-lg text-2xl font-black text-white">Register User Database Record</h2>
          <p className="mt-1 text-xs text-[#bccabb]">Creates new user record in Supabase Users Table</p>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignupSubmit} className="mt-6 space-y-3.5">
          <div>
            <label className="block text-xs font-mono text-[#bccabb] mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Aarav Sharma"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#bccabb] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="aarav@pune.edu.in"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-mono text-[#bccabb] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#bccabb] mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-[#6bfb9a] focus:outline-none"
              />
            </div>
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

          <button
            type="submit"
            className="w-full rounded-xl bg-[#6bfb9a] py-3 text-sm font-bold text-[#003919] hover:bg-[#59e68a] transition-all"
          >
            Create Database Record & Begin Onboarding →
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-white/10 text-center text-xs text-[#bccabb]">
          Already have a record in the database?{' '}
          <button onClick={handleNavToLogin} className="text-[#6bfb9a] font-bold underline">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
