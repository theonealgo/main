// app/auth/AuthClientPage.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

type PlanKey = 'the_one_stock' | 'the_one_elite' | 'the_one_premium';

const PLAN_CONFIG: Record<PlanKey, { label: string; monthly: number; yearly: number }> = {
  the_one_stock:   { label: 'The One: Stock Swing Analyzer',    monthly: 49.99, yearly: 499.90 },
  the_one_elite:   { label: 'The One Elite – Dynamic Liquidity', monthly: 59.99, yearly: 599.90 },
  the_one_premium: { label: 'The One Premium (both indicators)',monthly: 99.99, yearly: 999.90 },
};

export default function AuthClientPage() {
  const params = useSearchParams();
  const router = useRouter();
  const hint = params.get('screen_hint');
  const initialView = hint === 'login' ? 'login' : hint === 'forgot' ? 'forgot' : 'signup';
  const [view, setView] = useState<'signup' | 'login' | 'forgot'>(initialView);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const rawPlan    = (params.get('plan') as PlanKey) || 'the_one_stock';
  const rawBilling = (params.get('billing') as 'monthly' | 'yearly') || 'monthly';

  const [tvUser,   setTvUser]     = useState('');
  const [email,    setEmail]      = useState('');
  const [password, setPassword]   = useState('');
  const [plan,     setPlan]       = useState<PlanKey>(rawPlan);
  const [billing,  setBilling]    = useState<'monthly' | 'yearly'>(rawBilling);

  const price = billing === 'monthly'
    ? PLAN_CONFIG[plan].monthly
    : PLAN_CONFIG[plan].yearly;

  // --- Handlers ---
  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password, plan }),
      });
      if (!signupRes.ok) throw new Error('Signup failed.');

      const saveRes = await fetch('/api/save-user', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, tradingViewUsername: tvUser }),
      });
      if (!saveRes.ok) throw new Error('Saving user info failed.');

      const stripeRes = await fetch('/api/create-stripe-session', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ plan, billing, email }),
      });
      const { url } = await stripeRes.json();
      if (!url) throw new Error('Stripe session creation failed.');

      window.location.href = url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  function handleGoogle() {
    signIn('google', { callbackUrl: `${window.location.origin}/dashboard` });
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      email, password,
      callbackUrl: '/dashboard'
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

  // --- Render ---
  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center p-6">
      {/* background image behind form */}
      <Image
        src="/images/bground.jpg"
        alt="Background"
        fill
        className="absolute inset-0 object-cover opacity-30"
        priority
      />

      <div className="relative z-10 max-w-lg w-full space-y-8">
        {/* Tabs */}
        <div className="flex bg-gray-900 rounded-lg overflow-hidden">
          {(['signup','login','forgot'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setView(tab); setError(''); }}
              className={`flex-1 py-3 font-semibold ${
                view===tab ? 'bg-teal-500 text-black' : 'bg-gray-800'
              }`}
            >
              {tab==='signup' ? 'Sign Up'
                : tab==='login' ? 'Log In'
                : 'Forgot Password'}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}

        {/* Sign Up */}
        {view==='signup' && (
          <form onSubmit={handleSignup} className="space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-lg shadow hover:bg-gray-100 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-..."/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-..."/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-..."/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 ..."/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="px-4 text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            <input
              type="text" placeholder="TradingView Username" required
              value={tvUser} onChange={e=>setTvUser(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />
            <input
              type="email" placeholder="Email" required
              value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />
            <input
              type="password" placeholder="Password" required
              value={password} onChange={e=>setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />

            <select
              value={plan} onChange={e=>setPlan(e.target.value as PlanKey)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            >
              {Object.entries(PLAN_CONFIG).map(([k,c])=>(
                <option key={k} value={k}>{c.label}</option>
              ))}
            </select>

            <div className="flex gap-4 justify-center">
              {(['monthly','yearly'] as const).map(cycle=>(
                <label key={cycle} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={billing===cycle}
                    onChange={()=>setBilling(cycle)}
                  />
                  {cycle.charAt(0).toUpperCase()+cycle.slice(1)}
                </label>
              ))}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 py-3 rounded-lg font-semibold"
            >
              {loading ? 'Processing…' : `Start 30-Day Free Trial ($${price})`}
            </button>
          </form>
        )}

        {/* Log In */}
        {view==='login' && (
          <form onSubmit={handleLogin} className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg">
            <input
              type="email" placeholder="Email" required
              value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />
            <input
              type="password" placeholder="Password" required
              value={password} onChange={e=>setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />
            <button
              type="submit" disabled={loading}
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

        {/* Forgot Password */}
        {view==='forgot' && (
          <form onSubmit={handleForgot} className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg">
            <input
              type="email" placeholder="Enter your email" required
              value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 py-3 rounded-lg font-semibold"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
