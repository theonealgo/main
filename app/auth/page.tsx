'use client';
export const dynamic = 'force-dynamic';

import React, { Suspense, useState, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

type PlanKey = 'the_one_stock' | 'the_one_elite' | 'the_one_premium';

const PLAN_CONFIG: Record<PlanKey, { label: string; monthly: number; yearly: number }> = {
  the_one_stock:   { label: 'The One: Stock Swing Analyzer [TheoneAlgo]',             monthly: 49.99,  yearly: 499.90 },
  the_one_elite:   { label: 'The One Elite – Dynamic Liquidity Strategy [Theonealgo]', monthly: 59.99,  yearly: 599.90 },
  the_one_premium: { label: 'The One Premium (both indicators)',                   monthly: 99.99,  yearly: 999.90 },
};

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading authentication…</div>}>
      <AuthContent />
    </Suspense>
  );
}

function AuthContent() {
  const params      = useSearchParams();
  const router      = useRouter();
  const screenHint  = params.get('screen_hint');
  const initialView = screenHint === 'login' ? 'login' : screenHint === 'forgot' ? 'forgot' : 'signup';
  const [view, setView] = useState<'signup'|'login'|'forgot'>(initialView);

  // Shared
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // Signup
  const rawPlan    = (params.get('plan')    as PlanKey)        || 'the_one_stock';
  const rawBilling = (params.get('billing') as 'monthly'|'yearly') || 'monthly';
  const [tvUser,   setTvUser]    = useState('');
  const [email,    setEmail]     = useState('');
  const [password, setPassword]  = useState('');
  const [plan,     setPlan]      = useState<PlanKey>(rawPlan);
  const [billing,  setBilling]   = useState<'monthly'|'yearly'>(rawBilling);

  // Login
  const [loginEmail,    setLoginEmail]    = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot
  const [forgotEmail, setForgotEmail] = useState('');

  const price = billing === 'monthly'
    ? PLAN_CONFIG[plan].monthly
    : PLAN_CONFIG[plan].yearly;

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

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

    try {
      const stripeRes = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billing, email }),
      });
      const { url } = await stripeRes.json();
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail }),
    });
    if (!resp.ok) setError('Failed to send reset link');
    else setError('Check your email for instructions');
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex bg-black text-white">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          {/* Tabs */}
          <div className="flex space-x-2">
            {(['signup','login','forgot'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => { setView(mode); setError(''); }}
                className={`flex-1 py-2 rounded ${
                  view === mode ? 'bg-teal-500 text-black' : 'bg-gray-800'
                }`}
              >
                {mode === 'signup' ? 'Sign Up'
                 : mode === 'login'  ? 'Log In'
                 :                    'Forgot?'}
              </button>
            ))}
          </div>

          {error && <p className="text-red-400">{error}</p>}

          {/* Sign Up */}
          {view === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              …{/* same inputs/buttons as above */}…
            </form>
          )}

          {/* Log In */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              …{/* same login form */}…
            </form>
          )}

          {/* Forgot Password */}
          {view === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              …{/* forgot form */}…
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
