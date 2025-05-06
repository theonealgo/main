'use client';
export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');

  if (status === 'loading') return <p>Loading session...</p>;
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleSubmit = async () => {
    const res = await fetch('/api/save-tradingview-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (res.ok) {
      router.push('/success');
    } else {
      alert('Failed to save username');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">
          Enter Your TradingView Username
        </h1>
        <input
          type="text"
          placeholder="TradingView Username"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
