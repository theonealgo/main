// app/auth/page.tsx
'use client';
export const dynamic = 'force-dynamic';

import React, { useState, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

type PlanKey = 'the_one_stock' | 'the_one_elite' | 'the_one_premium';

const PLAN_CONFIG: Record<PlanKey, { label: string; monthly: number; yearly: number }> = {
  the_one_stock:   { label: 'The One: Stock Swing Analyzer',              monthly: 49.99, yearly: 499.90 },
  the_one_elite:   { label: 'The One Elite – Dynamic Liquidity',           monthly: 59.99, yearly: 599.90 },
  the_one_premium: { label: 'The One Premium (both indicators)',          monthly: 99.99, yearly: 999.90 },
};

export default function AuthPage() {
  const params     = useSearchParams();
  const router     = useRouter();
  const hint       = params.get('screen_hint');
  const initialView = hint === 'login' ? 'login' : hint === 'forgot' ? 'forgot' : 'signup';
  const [view, setView] = useState<'signup' | 'login' | 'forgot'>(initialView);

  // Shared state
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // Signup fields
  const rawPlan    = (params.get('plan')    as PlanKey)               || 'the_one_stock';
  const rawBilling = (params.get('billing') as 'monthly'|'yearly')   || 'monthly';
  const [tvUser,   setTvUser]    = useState('');
  const [email,    setEmail]     = useState('');
  const [password, setPassword]  = useState('');
  const [plan,     setPlan]      = useState<PlanKey>(rawPlan);
  const [billing,  setBilling]   = useState<'monthly'|'yearly'>(rawBilling);

  // Login fields
  const [loginEmail,    setLoginEmail]    = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot field
  const [forgotEmail, setForgotEmail] = useState('');

  const price = billing === 'monthly'
    ? PLAN_CONFIG[plan].monthly
    : PLAN_CONFIG[plan].yearly;

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1) Credentials signup
    const res = await signIn('credentials', {
      redirect: false,
      tradingViewUsername: tvUser,
      email, password, plan, billing,
    });
    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    // 2) Stripe checkout
    try {
      const r = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ plan, billing, email }),
      });
      const { url } = await r.json();
      if (!url) throw new Error('Checkout failed');
      router.push(url);
    } catch (err: any) {
      setError(err.message || 'Checkout error');
      setLoading(false);
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      email: loginEmail,
      password: loginPassword,
      callbackUrl: '/dashboard',
    });
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const resp = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ email: forgotEmail }),
    });
    setError(resp.ok ? 'Check your email for instructions' : 'Failed to send reset link');
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* TABS */}
        <div className="flex space-x-2">
          {(['signup','login','forgot'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setView(m); setError(''); }}
              className={`
                flex-1 py-2 rounded
                ${view === m ? 'bg-teal-500 text-black' : 'bg-gray-800'}
              `}
            >
              {m === 'signup' ? 'Sign Up' : m === 'login' ? 'Log In' : 'Forgot?'}
            </button>
          ))}
        </div>
        {error && <p className="text-red-400">{error}</p>}

        {/* SIGN UP */}
        {view === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4 bg-gray-900 p-6 rounded-lg">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full py-3 bg-white text-black rounded-lg"
            >
              Continue with Google
            </button>
            <div className="text-center text-gray-400">OR</div>

            <input
              type="text" required placeholder="TradingView Username"
              value={tvUser} onChange={e => setTvUser(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded"
            />
            <input
              type="email" required placeholder="Email"
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded"
            />
            <input
              type="password" required placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded"
            />

            <select
              value={plan}
              onChange={e => setPlan(e.target.value as PlanKey)}
              className="w-full px-4 py-2 bg-gray-800 rounded"
            >
              {Object.entries(PLAN_CONFIG).map(([k, c]) => (
                <option key={k} value={k}>{c.label}</option>
              ))}
            </select>

            <div className="flex gap-4">
              {(['monthly','yearly'] as const).map(cycle => (
                <label key={cycle} className="flex-1 flex items-center gap-2">
                  <input
                    type="radio" name="billing" value={cycle}
                    checked={billing === cycle}
                    onChange={() => setBilling(cycle)}
                    className="w-4 h-4"
                  />
                  {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                </label>
              ))}
            </div>

            <p className="text-center text-lg font-bold">${price}/{billing}</p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 rounded disabled:opacity-50"
            >
              {loading ? 'Processing…' : 'Start 30-Day Free Trial'}
            </button>
          </form>
        )}

        {/* LOG IN */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 bg-gray-900 p-6 rounded-lg">
            <input
              type="email" required placeholder="Email"
              value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded"
            />
            <input
              type="password" required placeholder="Password"
              value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 rounded disabled:opacity-50"
            >
              {loading ? 'Processing…' : 'Log In'}
            </button>
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full py-3 bg-white text-black rounded"
            >
              Continue with Google
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {view === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4 bg-gray-900 p-6 rounded-lg">
            <input
              type="email" required placeholder="Your Email"
              value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 rounded disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
