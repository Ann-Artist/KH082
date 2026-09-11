'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginDatabaseUser } from '../../lib/supabase/auth';

export default function LoginPage(props: any) {
  const onNavigate = props?.onNavigate;
  const onUserLoginSuccess = props?.onUserLoginSuccess;
  const router = useRouter();
  const [email, setEmail] = useState('aarav.sharma@pune.edu.in');
  const [password, setPassword] = useState('aarav2026');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Authenticate credentials against User Database Table
    const result = loginDatabaseUser(email, password);

    if (result.success) {
      if (typeof onUserLoginSuccess === 'function') {
        onUserLoginSuccess();
      }
      if (typeof onNavigate === 'function') {
        onNavigate('/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      setErrorMsg(result.error || 'Authentication failed.');
    }
  };

  const handleNavToSignup = () => {
    if (typeof onNavigate === 'function') {
      onNavigate('/signup');
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#061910] via-[#0b271c] to-[#030d08] px-4 py-12 text-gray-900 font-sans">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl text-left">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#10b981] border border-emerald-200">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          </div>
          <h2 className="mt-3 text-2xl font-black text-gray-900">Database Log In</h2>
          <p className="mt-1 text-xs text-gray-500 font-medium">Authenticates credentials against Supabase Users Table</p>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="aarav.sharma@pune.edu.in"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-gray-900 focus:border-[#10b981] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-gray-900 focus:border-[#10b981] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#111827] py-3 text-sm font-bold text-white hover:bg-black transition-all shadow-sm"
          >
            Authenticate & Open Dashboard →
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-600 font-medium">
          Don't have an account in the database yet?{' '}
          <button onClick={handleNavToSignup} className="text-[#10b981] font-bold underline">
            Sign Up & Register Account
          </button>
        </div>
      </div>
    </div>
  );
}
