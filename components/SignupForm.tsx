'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

interface SignupFormProps {
  plan: string;
  billing: string;
}

export default function SignupForm({ plan, billing }: SignupFormProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tradingViewUsername, setTradingViewUsername] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(plan);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, plan: selectedPlan }),
      });

      if (!signupRes.ok) throw new Error('Account creation failed.');

      const saveRes = await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, tradingViewUsername }),
      });

      if (!saveRes.ok) throw new Error('Failed to save user info.');

      const stripeRes = await fetch('/api/create-stripe-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, billing, email }),
      });

      const { url } = await stripeRes.json();
      if (!url) throw new Error('Stripe session failed.');

      window.location.href = url;
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gray-900 rounded-xl p-10 shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          Start Your Free Trial and Unlock Powerful Trading Tools
        </h1>

        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={() => signIn('google')}
            className="bg-white text-black font-semibold py-4 px-8 rounded-lg hover:opacity-90 transition flex items-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-4 text-gray-400 text-lg">OR</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {errorMsg && (
          <p className="text-red-500 text-lg text-center mb-6">{errorMsg}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-lg mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full bg-gray-800 text-white px-5 py-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg mb-2">TradingView Username</label>
            <input
              type="text"
              value={tradingViewUsername}
              onChange={(e) => setTradingViewUsername(e.target.value)}
              placeholder="Your TradingView username"
              required
              className="w-full bg-gray-800 text-white px-5 py-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full bg-gray-800 text-white px-5 py-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-lg mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              className="w-full bg-gray-800 text-white px-5 py-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-xl font-bold text-center mb-4">Choose Your Plan</label>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="w-full bg-gray-800 text-white px-5 py-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            required
          >
            <option value="the_one_stock">The One Stocks - 30 Day Free Trial</option>
            <option value="the_one_elite">The One Elite - 30 Day Free Trial</option>
            <option value="the_one_premium">The One Premium - 30 Day Free Trial</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white text-xl font-bold py-5 px-6 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? (
            <div className="flex justify-center items-center gap-3">
              <span className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full"></span>
              Processing...
            </div>
          ) : (
            'Start 30-Day Free Trial'
          )}
        </button>

        <p className="text-gray-400 text-center mt-8 text-lg">
          By continuing, you agree to our{' '}
          <Link href="/legal" className="text-blue-400 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/disclaimer" className="text-blue-400 hover:underline">
            Disclaimer
          </Link>.
        </p>
      </form>
    </div>
  );
}
