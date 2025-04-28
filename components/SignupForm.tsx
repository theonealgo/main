'use client';

import { useState } from 'react';

interface SignupFormProps {
  plan: string;
  billing: string;
}

export default function SignupForm({ plan, billing }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [tradingViewUsername, setTradingViewUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { email, tradingViewUsername, plan, billing });
    // TODO: Here you can send the form data to your server.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">TradingView Username</label>
            <input
              type="text"
              value={tradingViewUsername}
              onChange={(e) => setTradingViewUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="text-sm text-gray-600">
            Selected Plan: <strong>{plan}</strong><br />
            Billing Cycle: <strong>{billing}</strong>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
