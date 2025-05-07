'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

interface Props {
  plan: string;      // initial plan key from URL
  billing: string;   // initial billing cycle from URL
}

type PlanKey =
  | 'the_one_stock'
  | 'the_one_elite'
  | 'the_one_premium';

const PLAN_CONFIG: Record<PlanKey, {
  label: string;
  monthlyPrice: string;
  yearlyPrice: string;
}> = {
  the_one_stock: {
    label: 'The One: Stock Swing Analyzer [TheoneAlgo]',
    monthlyPrice: '$49.99',
    yearlyPrice:  '$499.90',
  },
  the_one_elite: {
    label: 'The One Elite – Dynamic Liquidity Strategy [Theonealgo]',
    monthlyPrice: '$59.99',
    yearlyPrice:  '$599.90',
  },
  the_one_premium: {
    label: 'The One Premium (both indicators)',
    monthlyPrice: '$99.99',
    yearlyPrice:  '$999.90',
  },
};

export default function SignupForm({ plan, billing }: Props) {
  const [loading, setLoading]   = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [tvUser, setTvUser]     = useState('');

  const [selectedPlan, setSelectedPlan]       = useState<PlanKey>(plan as PlanKey);
  const [selectedBilling, setSelectedBilling] = useState<'monthly'|'yearly'>(billing as 'monthly'|'yearly');

  // Price for the UI
  const price = selectedBilling === 'monthly'
    ? PLAN_CONFIG[selectedPlan].monthlyPrice
    : PLAN_CONFIG[selectedPlan].yearlyPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMsg('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      tradingViewUsername: tvUser,
      plan:    selectedPlan,
      billing: selectedBilling,
      callbackUrl: '/api/stripe/create-checkout',
    });

    if (res?.error) {
      setErrorMsg(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-gray-900 p-8 rounded-lg space-y-6 shadow-lg">

        <h2 className="text-2xl font-bold text-center">Start Your 30-Day Free Trial</h2>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full py-3 bg-white text-black rounded-lg flex items-center justify-center gap-2"
        >
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
            value={tvUser}
            onChange={e => setTvUser(e.target.value)}
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
            onChange={e => setSelectedPlan(e.target.value as PlanKey)}
            className="w-full px-4 py-2 bg-gray-800 rounded focus:outline-none"
            required
          >
            {Object.entries(PLAN_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>

        {/* Billing Cycle */}
        <div className="flex gap-4">
          {(['monthly', 'yearly'] as const).map(cycle => (
            <label key={cycle} className="flex-1">
              <input
                type="radio"
                name="billing"
                value={cycle}
                checked={selectedBilling === cycle}
                onChange={() => setSelectedBilling(cycle)}
                className="mr-2"
              />
              {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
            </label>
          ))}
        </div>

        {/* Price Display */}
        <p className="text-center text-xl">
          <span className="font-bold">{price}</span>/{selectedBilling}
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Processing…' : `Start ${selectedBilling.charAt(0).toUpperCase() + selectedBilling.slice(1)} Trial`}
        </button>

        {/* Link to existing sign in */}
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
