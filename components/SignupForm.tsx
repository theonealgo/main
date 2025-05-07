// components/SignupForm.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

interface Props {
  plan: string;      // initial plan from URL
  billing: string;   // "monthly" or "yearly"
}

export default function SignupForm({ plan, billing }: Props) {
  const [loading, setLoading]   = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [tradingViewUsername, setTradingViewUsername] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(plan);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMsg('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      tradingViewUsername,
      plan: selectedPlan,
      billing,
      callbackUrl: '/api/stripe/create-checkout',
    });

    if (res?.error) {
      setErrorMsg(res.error);
      setLoading(false);
    }
    // on success, NextAuth kicks off Stripe checkout
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-gray-900 p-8 rounded-lg space-y-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center">Create Your Account</h2>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full py-3 bg-white text-black rounded-lg flex items-center justify-center gap-2"
        >
          {/* insert your Google SVG icon here */}
          Continue with Google
        </button>

        <div className="flex items-center">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-3 text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

        {/* TradingView Username */}
        <div>
          <label className="block mb-1">TradingView Username</label>
          <input
            type="text"
            required
            value={tradingViewUsername}
            onChange={e => setTradingViewUsername(e.target.value)}
            placeholder="yourTVusername"
            className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none"
          />
        </div>

        {/* Plan Selector */}
        <div>
          <label className="block mb-1">Choose Your Plan</label>
          <select
            value={selectedPlan}
            onChange={e => setSelectedPlan(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none"
            required
          >
            <option value="the_one_stock">The One Stocks – 30-Day Free Trial</option>
            <option value="the_one_elite">The One Elite – 30-Day Free Trial</option>
            <option value="the_one_premium">The One Premium – 30-Day Free Trial</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Processing…' : 'Start Free Trial'}
        </button>

        {/* Link to sign-in for existing users */}
        <p className="text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
