'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect 404 routes back to dashboard
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
        <span className="material-symbols-outlined text-3xl">spa</span>
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">Redirecting to EcoQuest Dashboard...</h2>
        <p className="text-xs text-gray-600 font-medium mt-1">Please wait while we route you to your workspace.</p>
      </div>
      <button
        onClick={() => router.push('/dashboard')}
        className="rounded-xl bg-[#111827] px-5 py-2.5 text-xs font-bold text-white hover:bg-black transition-all shadow-sm"
      >
        Go to Dashboard Now →
      </button>
    </div>
  );
}
