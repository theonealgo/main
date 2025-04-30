'use client';

import { useState } from 'react';

interface SignupFormProps {
  plan?: string;  // Make optional with ?
  billing?: string; // Make optional with ?
}

export default function SignupForm({ plan = '', billing = '' }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [tradingViewUsername, setTradingViewUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { email, tradingViewUsername, plan, billing });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... keep existing form elements ... */}
          
          <div className="text-sm text-gray-600">
            {plan && <>Selected Plan: <strong>{plan}</strong><br /></>}
            {billing && <>Billing Cycle: <strong>{billing}</strong></>}
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
