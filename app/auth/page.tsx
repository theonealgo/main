'use client';
export const dynamic = 'force-dynamic';

import { useState, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

type PlanKey = 'the_one_stock' | 'the_one_elite' | 'the_one_premium';

const PLAN_CONFIG: Record<PlanKey, { label: string; monthly: number; yearly: number }> = {
  the_one_stock: { label: 'The One: Stock Swing Analyzer', monthly: 49.99, yearly: 499.90 },
  the_one_elite: { label: 'The One Elite – Dynamic Liquidity', monthly: 59.99, yearly: 599.90 },
  the_one_premium: { label: 'The One Premium (both indicators)', monthly: 99.99, yearly: 999.90 },
};

export default function AuthPage() {
  const params = useSearchParams();
  const router = useRouter();
  const hint = params.get('screen_hint');
  const [view, setView] = useState<'signup' | 'login' | 'forgot'>(hint === 'login' ? 'login' : hint === 'forgot' ? 'forgot' : 'signup');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Signup
  const [tvUser, setTvUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState<PlanKey>((params.get('plan') as PlanKey) || 'the_one_stock');
  const [billing, setBilling] = useState<'monthly'|'yearly'>((params.get('billing') as 'monthly'|'yearly') || 'monthly');
  const price = billing === 'monthly' ? PLAN_CONFIG[plan].monthly : PLAN_CONFIG[plan].yearly;

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, plan }),
      });
      if (!signupResponse.ok) throw new Error('Signup failed');

      const trackingResponse = await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tradingViewUsername: tvUser }),
      });
      if (!trackingResponse.ok) throw new Error('Tracking failed');

      const stripeRes = await fetch('/api/create-stripe-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billing, email }),
      });
      const { url } = await stripeRes.json();
      if (!url) throw new Error('Stripe checkout failed');

      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Signup error');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8">
      <div className="max-w-xl w-full bg-gray-900 rounded-xl p-8 md:p-12 shadow-xl space-y-6 text-white">
        <div className="flex justify-center gap-2 bg-gray-800 p-1 rounded-lg">
          {['signup', 'login', 'forgot'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setView(tab as any); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                view === tab ? 'bg-teal-500 text-black' : 'text-white'
              }`}
            >
              {tab === 'signup' ? 'Sign Up' : tab === 'login' ? 'Log In' : 'Forgot Password'}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {view === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full py-3 bg-white text-black rounded-lg"
            >
              Continue with Google
            </button>

            <div className="text-center text-gray-400 my-4">OR</div>

            <input required className="w-full px-4 py-3 bg-gray-800 rounded" placeholder="TradingView Username" value={tvUser} onChange={e => setTvUser(e.target.value)} />
            <input required type="email" className="w-full px-4 py-3 bg-gray-800 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input required type="password" className="w-full px-4 py-3 bg-gray-800 rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

            <select value={plan} onChange={e => setPlan(e.target.value as PlanKey)} className="w-full px-4 py-3 bg-gray-800 rounded">
              {Object.entries(PLAN_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>

            <div className="flex gap-4">
              {(['monthly', 'yearly'] as const).map(cycle => (
                <label key={cycle} className="flex-1 flex items-center gap-2">
                  <input type="radio" checked={billing === cycle} onChange={() => setBilling(cycle)} className="h-4 w-4" />
                  {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                </label>
              ))}
            </div>

            <button type="submit" className="w-full bg-blue-600 py-3 rounded-lg disabled:opacity-50" disabled={loading}>
              {loading ? 'Processing…' : `Start 30-Day Free Trial ($${price})`}
            </button>
          </form>
        )}

        {view === 'login' && (
          <form className="space-y-4">
            <input required type="email" className="w-full px-4 py-3 bg-gray-800 rounded" placeholder="Email" />
            <input required type="password" className="w-full px-4 py-3 bg-gray-800 rounded" placeholder="Password" />
            <button className="w-full bg-blue-600 py-3 rounded-lg">Log In</button>
          </form>
        )}

        {view === 'forgot' && (
          <form className="space-y-4">
            <input required type="email" className="w-full px-4 py-3 bg-gray-800 rounded" placeholder="Your Email" />
            <button className="w-full bg-blue-600 py-3 rounded-lg">Send Reset Link</button>
          </form>
        )}
      </div>
    </div>
  );
}
