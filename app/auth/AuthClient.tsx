// app/auth/AuthClient.tsx
"use client";

import React, { useState, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import Link from 'next/link';


type PlanKey = 'the_one_stock' | 'the_one_elite' | 'the_one_premium';
const PLAN_CONFIG: Record<PlanKey, { label: string; monthly: number; yearly: number }> = {
  the_one_stock:   { label: 'The One: Stock Swing Analyzer',    monthly: 49.99,  yearly: 499.90 },
  the_one_elite:   { label: 'The One Elite – Dynamic Liquidity', monthly: 59.99,  yearly: 599.90 },
  the_one_premium: { label: 'The One Premium (both indicators)',monthly: 99.99,  yearly: 999.90 },
};

export default function AuthClient() {
  const params = useSearchParams();
  const router = useRouter();
  const hint   = params.get('screen_hint');
  const [view, setView] = useState<'signup' | 'login' | 'forgot'>(
    hint === 'login' ? 'login'
    : hint === 'forgot' ? 'forgot'
    : 'signup'
  );

  // shared form state
  const [tvUser,   setTvUser]   = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [plan,     setPlan]     = useState<PlanKey>(
    (params.get('plan') as PlanKey) || 'the_one_stock'
  );
  const [billing,  setBilling]  = useState<'monthly'|'yearly'>(
    params.get('billing') === 'yearly' ? 'yearly' : 'monthly'
  );
  const price = billing === 'monthly'
    ? PLAN_CONFIG[plan].monthly
    : PLAN_CONFIG[plan].yearly;

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // --- handlers ---
  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const r1 = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ email, password, plan }),
      });
      if (!r1.ok) throw new Error('Signup failed.');

      await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ email, tradingViewUsername: tvUser }),
      });

      const r3 = await fetch('/api/create-stripe-session', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ plan, billing, email }),
      });
      const { url } = await r3.json();
      if (!url) throw new Error('Stripe session creation failed.');

      window.location.href = url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  function handleGoogle() {
    signIn('google', { callbackUrl: '/dashboard' });
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      email, password,
      callbackUrl: '/dashboard',
    });
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  }

  function handleForgot(e: FormEvent) {
    e.preventDefault();
    alert('Password reset link sent to ' + email);
  }

  // --- render ---
  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center p-6">
      {/* dimmed background */}
      <Image
        src="/images/bground.jpg"
        alt="Background"
        fill
        className="absolute inset-0 object-cover opacity-30"
        priority
      />

      <div className="relative z-10 w-full max-w-lg space-y-8">
        {/* tabs */}
        <div className="flex bg-gray-900 rounded-lg overflow-hidden">
          {(['signup','login','forgot'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setView(tab); setError(''); }}
              className={`flex-1 py-3 font-semibold ${
                view === tab ? 'bg-teal-500 text-black' : 'bg-gray-800'
              }`}
            >
              {tab === 'signup'
                ? 'Sign Up'
                : tab === 'login'
                ? 'Log In'
                : 'Forgot Password'}
            </button>
          ))}
        </div>

        {error && <div className="text-center text-red-500">{error}</div>}

        {/* SIGN UP */}
        {view === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg">
<button
  type="button"
  onClick={handleGoogle}
  disabled={loading}
  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold bg-white text-gray-800 hover:bg-gray-100 transition"
>
  <Image
    src="/signinwithgoogle.png"
    alt="Sign in with Google"
    width={24}
    height={24}
  />
  Continue with Google
</button>

            <div className="flex items-center">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="px-4 text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            <input
              type="text"
              placeholder="TradingView Username"
              required
              value={tvUser}
              onChange={e => setTvUser(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />

            <select
              value={plan}
              onChange={e => setPlan(e.target.value as PlanKey)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            >
              {Object.entries(PLAN_CONFIG).map(([k, c]) => (
                <option key={k} value={k}>{c.label}</option>
              ))}
            </select>

            <div className="flex gap-4 justify-center">
              {(['monthly','yearly'] as const).map(cycle => (
                <label key={cycle} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={billing === cycle}
                    onChange={() => setBilling(cycle)}
                  />
                  {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 py-3 rounded-lg font-semibold"
            >
              {loading ? 'Processing…' : `Start 30-Day Free Trial ($${price})`}
            </button>
          </form>
        )}

        {/* LOG IN */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 py-3 rounded-lg font-semibold"
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>
            <p className="text-center text-gray-400">
              <Link href="/auth?screen_hint=signup" className="text-teal-400 hover:underline">
                Need an account?
              </Link>
            </p>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {view === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg">
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />
            <button className="w-full bg-blue-600 py-3 rounded-lg font-semibold">
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
