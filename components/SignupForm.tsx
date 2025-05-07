'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

interface Props { plan: string; billing: string; }

export default function SignupForm({ plan, billing }: Props) {
  const [loading, setLoading]   = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [name, setName]                         = useState('');
  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');
  const [tradingViewUsername, setTradingViewUsername] = useState('');
  const [selectedPlan, setSelectedPlan]         = useState(plan);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true); setErrorMsg('');

    const res = await signIn('credentials', {
      redirect: false,
      name,
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
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="max-w-2xl w-full bg-gray-900 p-10 rounded-xl shadow-2xl space-y-8">
        <h1 className="text-4xl font-bold text-center">Start Your 30-Day Free Trial</h1>

        {/* Google button */}
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full py-4 bg-white text-black rounded-lg flex items-center justify-center space-x-3"
        >
          {/* SVG omitted for brevity */}Continue with Google
        </button>

        {/* OR divider */}
        <div className="flex items-center">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-4 text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

        {/* Name, TV username, Email, Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ...inputs... */}
        </div>

        {/* Plan selector */}
        <div>
          <label className="block mb-2 font-bold text-center">Choose Your Plan</label>
          <select
            value={selectedPlan}
            onChange={e => setSelectedPlan(e.target.value)}
            className="w-full px-5 py-4 bg-gray-800 rounded-lg"
            required
          >
            <option value="the_one_stock">The One Stocks – 30-Day Free Trial</option>
            <option value="the_one_elite">The One Elite – 30-Day Free Trial</option>
            <option value="the_one_premium">The One Premium – 30-Day Free Trial</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg font-bold"
        >
          {loading ? 'Processing…' : 'Start Free Trial'}
        </button>

        <p className="text-center text-gray-400">
          By continuing, you agree to our{' '}
          <Link href="/legal" className="text-blue-400">Terms</Link> and{' '}
          <Link href="/disclaimer" className="text-blue-400">Disclaimer</Link>.
        </p>
      </form>
    </div>
  );
}
