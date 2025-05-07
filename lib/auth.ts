'use client';

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SignupForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tradingViewUsername, setTradingViewUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Keep original signup flow exactly as is
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, plan }),
      });
      if (!signupResponse.ok) throw new Error('Account creation failed');
      
      // Keep original tracking call
      const trackingResponse = await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, tradingViewUsername }),
      });
      if (!trackingResponse.ok) throw new Error('Data tracking failed');
      
      await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: `/dashboard?newUser=true&plan=${plan}`,
      });
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Left image - unchanged except for added overlay */}
      <div className="hidden lg:block relative w-1/2">
        <Image
          src="/images/bground.jpg"
          alt="Trading Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-12">
          <div className="max-w-md space-y-6">
            <h2 className="text-4xl font-bold">Join The One Signal</h2>
            <p className="text-xl text-gray-200">
              Precision trading signals with 98% win rate
            </p>
          </div>
        </div>
      </div>

      {/* Right form - improved layout but same functionality */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">
              Start Your {plan?.toUpperCase() || "Trading"} Trial
            </h2>
            <p className="text-gray-400">
              No credit card required. Cancel anytime.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="tradingview" className="block text-sm font-medium text-gray-300 mb-1">
                TradingView Username
              </label>
              <input
                id="tradingview"
                type="text"
                value={tradingViewUsername}
                onChange={(e) => setTradingViewUsername(e.target.value)}
                placeholder="Your TradingView username"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <input type="hidden" name="plan" value={plan || ''} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-600 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              `Start 30-Day ${plan?.toUpperCase() || "Trading"} Trial`
            )}
          </button>

          <p className="text-sm text-gray-400 text-center">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-blue-400 hover:underline">Terms</Link>,{" "}
            <Link href="/privacy" className="text-blue-400 hover:underline">Privacy</Link>, and{" "}
            <Link href="/disclaimer" className="text-blue-400 hover:underline">Disclaimer</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
