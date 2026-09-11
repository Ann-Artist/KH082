'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage(props: any) {
  const onNavigate = props?.onNavigate;
  const router = useRouter();

  const handleNav = (path: string) => {
    if (typeof onNavigate === 'function') {
      onNavigate(path);
    } else {
      router.push(path);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b110e] text-white">
      {/* Bioluminescent Background Lights */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#6bfb9a]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-[#7c3aed]/15 blur-3xl" />

      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6bfb9a]/15 text-[#6bfb9a]">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          </div>
          <span className="font-display-lg text-2xl font-extrabold tracking-tight">Eco<span className="text-[#6bfb9a]">Quest</span></span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNav('/login')}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-[#bccabb] hover:text-white transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => handleNav('/onboarding')}
            className="rounded-xl border border-[#6bfb9a]/40 bg-[#6bfb9a] px-5 py-2.5 text-sm font-bold text-[#003919] hover:bg-[#59e78a] transition-all shadow-[0_0_20px_rgba(107,251,154,0.3)]"
          >
            Start Eco Journey
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="mx-auto max-w-6xl px-6 py-16 text-center md:py-24">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#6bfb9a]/30 bg-[#6bfb9a]/10 px-4 py-1.5 font-mono text-xs font-bold text-[#6bfb9a]">
          <span>🌱 Gamified Personal Carbon Footprint AI for Pune</span>
        </div>

        <h1 className="font-display-lg text-4xl font-extrabold tracking-tight text-white md:text-6xl md:leading-tight">
          Turn Everyday Sustainable Actions into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6bfb9a] via-[#4ade80] to-[#ffd23f]">Personalized Game</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-[#bccabb] md:text-lg">
          Measure your estimated monthly carbon footprint, unlock personalized daily quests, verify real-world eco actions with AI Vision & GPS tracking, and compete on the Pune Wall of Champions.
        </p>

        {/* Core Loop Pill Tagline */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 font-mono text-xs text-white">
          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">Measure</span>
          <span className="text-[#6bfb9a]">→</span>
          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">Understand</span>
          <span className="text-[#6bfb9a]">→</span>
          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">Get Quests</span>
          <span className="text-[#6bfb9a]">→</span>
          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">Verify Proof</span>
          <span className="text-[#6bfb9a]">→</span>
          <span className="rounded-lg border border-[#ffd23f]/30 bg-[#ffd23f]/10 px-3 py-1.5 text-[#ffd23f]">Earn EcoXP</span>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => handleNav('/onboarding')}
            className="w-full sm:w-auto rounded-2xl bg-[#6bfb9a] px-8 py-4 text-base font-extrabold text-[#003919] shadow-[0_0_30px_rgba(107,251,154,0.4)] hover:bg-[#59e78a] transition-all transform hover:-translate-y-0.5"
          >
            Start Your Eco Journey (2 Min Survey)
          </button>

          <button
            onClick={() => handleNav('/dashboard')}
            className="w-full sm:w-auto rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-all"
          >
            Explore Interactive Demo Dashboard
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-[#121b16]/70 p-6 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6bfb9a]/10 text-[#6bfb9a]">
              <span className="material-symbols-outlined text-3xl">analytics</span>
            </div>
            <h3 className="mt-4 font-headline-lg text-lg font-bold text-white">Python Carbon Engine</h3>
            <p className="mt-2 text-xs text-[#bccabb]">
              Calculates baseline emissions across 5 categories: Transportation, Electricity, Food, Shopping, and Waste.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#121b16]/70 p-6 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <h3 className="mt-4 font-headline-lg text-lg font-bold text-white">EcoGuard Anti-Cheat</h3>
            <p className="mt-2 text-xs text-[#bccabb]">
              3-level verification with simulated AI Vision object detection & GPS route tracking to validate actions.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#121b16]/70 p-6 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd23f]/10 text-[#ffd23f]">
              <span className="material-symbols-outlined text-3xl">emoji_events</span>
            </div>
            <h3 className="mt-4 font-headline-lg text-lg font-bold text-white">Pune Leaderboards</h3>
            <p className="mt-2 text-xs text-[#bccabb]">
              Compete by Pune Ward (Kothrud, Baner, Viman Nagar) and export custom Instagram-style achievement cards.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
