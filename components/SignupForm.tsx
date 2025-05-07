'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link'; 

interface SignupFormProps {
  plan: string;
  billing: string;
}

export default function SignupForm({ plan, billing }: SignupFormProps) {
  const [loading, setLoading]   = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [name, setName]                         = useState('');
  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');
  const [tradingViewUsername, setTradingViewUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMsg('');

    // This single call does:
    // • CredentialsProvider.authorize() → create user in Supabase
    // • events.createUser() → upsert profile (name, TV username, plan, billing)
    // • redirect → /api/stripe/create-checkout (to start Stripe)
    const res = await signIn('credentials', {
      redirect: false,
      name,
      email,
      password,
      tradingViewUsername,
      plan,
      billing,
      callbackUrl: '/api/stripe/create-checkout',
    });

    if (res?.error) {
      setErrorMsg(res.error);
      setLoading(false);
      return;
    }
    // On success NextAuth will handle the redirect for us
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gray-900 rounded-xl p-10 shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          Start Your 30-Day Free Trial
        </h1>

        {/* Google button (unchanged) */}
        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={() =>
              signIn('google', { callbackUrl: '/dashboard' })
            }
            className="bg-white text-black font-semibold py-4 px-8 rounded-lg hover:opacity-90 transition flex items-center gap-3"
          >
            {/* SVG icon… */}
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
          {/* Full Name */}
          <div>
            <label className="block text-lg mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full bg-gray-800 text-white px-5 py-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* TradingView Username */}
          <div>
            <label className="block text-lg mb-2">TradingView Username</label>
            <input
              type="text"
              value={tradingViewUsername}
              onChange={e => setTradingViewUsername(e.target.value)}
              placeholder="Your TradingView username"
              required
              className="w-full bg-gray-800 text-white px-5 py-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full bg-gray-800 text-white px-5 py-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-lg mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              className="w-full bg-gray-800 text-white px-5 py-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Plan selector (you can remove this if you’re already passing plan via URL) */}
        <div className="mb-8">
          <label className="block text-xl font-bold text-center mb-4">Plan</label>
          <select
            value={plan}
            disabled
            className="w-full bg-gray-800 text-white px-5 py-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          >
            <option value={plan}>{plan.replace(/_/g, ' ')}</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white text-xl font-bold py-5 px-6 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading
            ? <div className="flex justify-center items-center gap-3">
                <span className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full"></span>
                Processing…
              </div>
            : 'Start 30-Day Free Trial'
          }
        </button>

        <p className="text-gray-400 text-center mt-8 text-lg">
          By continuing, you agree to our{' '}
          <Link href="/legal" className="text-blue-400 hover:underline">Terms of Service</Link>{' '}and{' '}
          <Link href="/disclaimer" className="text-blue-400 hover:underline">Disclaimer</Link>.
        </p>
      </form>
    </div>
  );
}
