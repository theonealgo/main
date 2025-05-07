'use client';

import { useState, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

type PlanKey = 'the_one_stock' | 'the_one_elite' | 'the_one_premium';

const PLAN_CONFIG: Record<PlanKey, { label: string; monthly: number; yearly: number }> = {
  the_one_stock:  { label: 'The One: Stock Swing Analyzer [TheoneAlgo]', monthly: 49.99, yearly: 499.90 },
  the_one_elite:  { label: 'The One Elite – Dynamic Liquidity Strategy [Theonealgo]', monthly: 59.99, yearly: 599.90 },
  the_one_premium:{ label: 'The One Premium (both indicators)', monthly: 99.99, yearly: 999.90 },
};

export default function AuthPage() {
  const params = useSearchParams();
  const router = useRouter();
  const initialView = (params.get('screen_hint') === 'login') ? 'login' : 'signup';
  const [view, setView] = useState<'signup'|'login'|'forgot'>(initialView);

  // Shared state
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Signup-specific
  const rawPlan     = params.get('plan')    as PlanKey || 'the_one_stock';
  const rawBilling  = params.get('billing') as 'monthly'|'yearly' || 'monthly';

  const [tvUser, setTvUser]       = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [plan, setPlan]           = useState<PlanKey>(rawPlan);
  const [billing, setBilling]     = useState<'monthly'|'yearly'>(rawBilling);

  // Login-specific
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot-specific
  const [forgotEmail, setForgotEmail] = useState('');

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      tradingViewUsername: tvUser,
      email,
      password,
      plan,
      billing,
      callbackUrl: '/api/stripe/create-checkout',
    });
    if (res?.error) {
      setError(res.error);
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
    }
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Call your Supabase reset endpoint
    const resp = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail }),
    });
    if (!resp.ok) {
      setError('Failed to send reset email.');
    } else {
      setError('Check your inbox for reset instructions.');
    }
    setLoading(false);
  }

  // Price display for signup
  const price = billing === 'monthly'
    ? PLAN_CONFIG[plan].monthly
    : PLAN_CONFIG[plan].yearly;

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Left/illustration side omitted for brevity */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-6">
          {/* Header + Toggle */}
          <div className="flex justify-between">
            <button
              className={`flex-1 py-2 ${view==='signup'?'bg-teal-500':'text-gray-400'}`}
              onClick={() => setView('signup')}
            >Sign Up</button>
            <button
              className={`flex-1 py-2 ${view==='login'?'bg-teal-500':'text-gray-400'}`}
              onClick={() => setView('login')}
            >Log In</button>
            <button
              className={`flex-1 py-2 ${view==='forgot'?'bg-teal-500':'text-gray-400'}`}
              onClick={() => setView('forgot')}
            >Forgot?</button>
          </div>

          {error && <p className="text-red-400">{error}</p>}

          {view === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text" placeholder="TradingView Username"
                required value={tvUser} onChange={e=>setTvUser(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded"
              />
              <input
                type="email" placeholder="Email"
                required value={email} onChange={e=>setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded"
              />
              <input
                type="password" placeholder="Password"
                required value={password} onChange={e=>setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded"
              />

              {/* Plan & Billing */}
              <select
                value={plan}
                onChange={e=>setPlan(e.target.value as PlanKey)}
                className="w-full p-3 bg-gray-800 rounded"
              >
                {Object.entries(PLAN_CONFIG).map(([k,c])=>(
                  <option key={k} value={k}>{c.label}</option>
                ))}
              </select>
              <div className="flex gap-4">
                {(['monthly','yearly'] as const).map(c=>(
                  <label key={c} className="flex-1">
                    <input
                      type="radio"
                      name="billing"
                      value={c}
                      checked={billing===c}
                      onChange={()=>setBilling(c)}
                      className="mr-2"
                    />
                    {c.charAt(0).toUpperCase()+c.slice(1)}
                  </label>
                ))}
              </div>
              <div className="text-center text-xl font-bold">
                ${price}/{billing}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 rounded disabled:opacity-50"
              >
                {loading ? 'Processing…' : 'Start 30-Day Free Trial'}
              </button>
            </form>
          )}

          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email" placeholder="Email"
                required value={loginEmail}
                onChange={e=>setLoginEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded"
              />
              <input
                type="password" placeholder="Password"
                required value={loginPassword}
                onChange={e=>setLoginPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded"
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

          {view === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <input
                type="email" placeholder="Your email"
                required value={forgotEmail}
                onChange={e=>setForgotEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded"
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
    </div>
  );
}
