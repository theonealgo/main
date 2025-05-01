// main/app/success/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id') || null;
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (sessionId) {
      setConfirmed(true);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">✅ You're All Set!</h1>
      <p className="text-lg mb-6">
        Your 30-day free trial has started. You now have access to{' '}
        <span className="text-teal-400 font-semibold">The One Algo</span> indicator.
      </p>

      {confirmed && (
        <p className="text-sm text-gray-400 mb-6">
          Session ID: <span className="text-teal-300">{sessionId}</span>
        </p>
      )}

      <Link
        href="/dashboard"
        className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
