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
  const params  = useSearchParams();
  const router  = useRouter();
  const hint    = params.get('screen_hint');
  const initial = hint === 'login' ? 'login' : hint === 'forgot' ? 'forgot' : 'signup';
  const [view, setView] = useState<'signup'|'login'|'forgot'>(initial);

  const rawPlan    = (params.get('plan') as PlanKey)       || 'the_one_stock';
  const rawBilling = (params.get('billing') as 'monthly'|'yearly') || 'monthly';

  const [tvUser,   setTvUser]   = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [plan,     setPlan]     = useState<PlanKey>(rawPlan);
  const [billing,  setBilling]  = useState<'monthly'|'yearly'>(rawBilling);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const price = billing === 'monthly'
    ? PLAN_CONFIG[plan].monthly
    : PLAN_CONFIG[plan].yearly;

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ email, password, plan }),
      });
      if (!signupRes.ok) throw new Error('Signup failed.');

      const saveRes = await fetch('/api/save-user', {
        method: 'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ email, tradingViewUsername: tvUser }),
      });
      if (!saveRes.ok) throw new Error('Saving user info failed.');

      const stripeRes = await fetch('/api/create-stripe-session', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
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

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
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

  function handleGoogle() {
    signIn('google', { callbackUrl: `${window.location.origin}/dashboard` });
  }

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center p-6">
      {/* background image */}
      <Image
        src="/images/bground.jpg"
        alt="Background"
        fill
        className="absolute inset-0 object-cover opacity-30"
        priority
      />

      <div className="relative z-10 max-w-lg w-full space-y-8">
        {/* tab selector */}
        <div className="flex bg-gray-900 rounded-lg overflow-hidden">
          {(['signup','login','forgot'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setView(tab); setError(''); }}
              className={`flex-1 py-3 font-semibold ${
                view === tab ? 'bg-teal-500 text-black' : 'bg-gray-800'
              }`}
            >
              {tab==='signup' ? 'Sign Up'
                : tab==='login' ? 'Log In'
                : 'Forgot Password'}
            </button>
          ))}
        </div>

        {error && <div className="text-center text-red-500">{error}</div>}

        {/* --- SIGN UP --- */}
        {view==='signup' && (
          <form onSubmit={handleSignup} className="space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#4285F4] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              <Image src="/images/google-icon.svg" alt="Google logo" width={20} height={20}/>
              Continue with Google
            </button>

            <div className="flex items-center">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="px-4 text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            <input
              type="text" placeholder="TradingView Username" required
              value={tvUser} onChange={e=>setTvUser(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded focus:outline-none"
            />
            <input
              type="email" placeholder="Email" required
              value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded focus:outline-none"
            />
            <input
              type="password" placeholder="Password" required
              value={password} onChange={e=>setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded focus:outline-none"
            />

            <select
              value={plan} onChange={e=>setPlan(e.target.value as PlanKey)}
              className="w-full px-4 py-3 bg-gray-800 rounded focus:outline-none"
            >
              {Object.entries(PLAN_CONFIG).map(([k,c])=>(
                <option key={k} value={k}>{c.label}</option>
              ))}
            </select>

            <div className="flex justify-center gap-4">
              {(['monthly','yearly'] as const).map(cycle => (
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
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-teal-500 hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Processing…' : `Start 30-Day Free Trial ($${price})`}
            </button>
          </form>
        )}

        {/* --- LOG IN --- */}
        {view==='login' && (
          <form onSubmit={handleLogin} className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg">
            <input
              type="email" placeholder="Email" required
              value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded focus:outline-none"
            />
            <input
              type="password" placeholder="Password" required
              value={password} onChange={e=>setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
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

        {/* --- FORGOT PASSWORD --- */}
        {view==='forgot' && (
          <form onSubmit={handleForgot} className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg">
            <input
              type="email" placeholder="Enter your email" required
              value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
