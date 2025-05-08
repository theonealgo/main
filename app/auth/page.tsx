'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState, FormEvent } from 'react';
import Link from 'next/link';

// Define your plan types
type PlanKey = 'the_one_stock' | 'the_one_elite' | 'the_one_premium';

// Plan configuration
const PLAN_CONFIG: Record<PlanKey, { label: string; monthly: number; yearly: number }> = {
  the_one_stock: { label: 'The One: Stock Swing Analyzer', monthly: 49.99, yearly: 499.90 },
  the_one_elite: { label: 'The One Elite – Dynamic Liquidity', monthly: 59.99, yearly: 599.90 },
  the_one_premium: { label: 'The One Premium (both indicators)', monthly: 99.99, yearly: 999.90 },
};

export default function AuthPage() {
  const params = useSearchParams();
  const router = useRouter();
  const hint = params.get('screen_hint');
  const initialView = hint === 'login' ? 'login' : hint === 'forgot' ? 'forgot' : 'signup';
  const [view, setView] = useState<'signup' | 'login' | 'forgot'>(initialView);

  // Common state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Signup-specific state
  const rawPlan = (params.get('plan') as PlanKey) || 'the_one_stock';
  const rawBilling = (params.get('billing') as 'monthly' | 'yearly') || 'monthly';
  const [tvUser, setTvUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState<PlanKey>(rawPlan);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>(rawBilling);
  const price = billing === 'monthly' ? PLAN_CONFIG[plan].monthly : PLAN_CONFIG[plan].yearly;

  // Signup handler
  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, plan }),
      });
      if (!signupRes.ok) throw new Error('Signup failed.');

      const saveRes = await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradingViewUsername: tvUser }),
      });
      if (!saveRes.ok) throw new Error('Saving user info failed.');

      const stripeRes = await fetch('/api/create-stripe-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billing, email }),
      });
      const { url } = await stripeRes.json();
      if (!url) throw new Error('Stripe session creation failed.');

      // redirect
      window.location.href = url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  // Login form component
  function LoginForm() {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');
    async function handleLogin(e: FormEvent) {
      e.preventDefault();
      await signIn('credentials', { email: loginEmail, password: loginPass, callbackUrl: '/dashboard' });
    }
    return (
      <form onSubmit={handleLogin} className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg">
        <input
          type="email"
          placeholder="Email"
          required
          value={loginEmail}
          onChange={e => setLoginEmail(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={loginPass}
          onChange={e => setLoginPass(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 rounded"
        />
        <button type="submit" className="w-full bg-blue-600 py-3 rounded font-semibold">
          Log In
        </button>
      </form>
    );
  }

  // Forgot password form
  function ForgotPasswordForm() {
    const [resetEmail, setResetEmail] = useState('');
    function handleReset(e: FormEvent) {
      e.preventDefault();
      alert('Password reset link sent to ' + resetEmail);
    }
    return (
      <form onSubmit={handleReset} className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg">
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={resetEmail}
          onChange={e => setResetEmail(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 rounded"
        />
        <button type="submit" className="w-full bg-blue-600 py-3 rounded font-semibold">
          Send Reset Link
        </button>
      </form>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8">
        {/* tabs */}
        <div className="flex bg-gray-900 rounded-lg overflow-hidden">
          {(['signup', 'login', 'forgot'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`flex-1 py-3 font-semibold ${view === tab ? 'bg-teal-500 text-black' : 'bg-gray-800'}`}
            >
              {tab === 'signup' ? 'Sign Up' : tab === 'login' ? 'Log In' : 'Forgot Password'}
            </button>
          ))}
        </div>

        {error && <div className="text-center text-red-500">{error}</div>}

        {view === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg">
            {/* Google login */}
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full bg-white text-black py-3 rounded font-semibold"
            >
              Continue with Google
            </button>

            <div className="text-center text-gray-400">OR</div>

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
              {(['monthly', 'yearly'] as const).map(cycle => (
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
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 py-3 rounded font-semibold"
            >
              {loading ? 'Processing...' : `Start 30-Day Free Trial ($${price})`}
            </button>
          </form>
        )}

        {view === 'login' && <LoginForm />}
        {view === 'forgot' && <ForgotPasswordForm />}
      </div>
    </div>
  );
}
