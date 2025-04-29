'use client';

import { useEffect, useState } from 'react';
import SignupForm from '../../components/SignupForm';

// Correct type for App Router searchParams
interface SignupPageProps {
  searchParams: URLSearchParams;
}

export default function SignupPage({ searchParams }: SignupPageProps) {
  const [plan, setPlan] = useState<string | null>(null);
  const [billing, setBilling] = useState<string | null>(null);

  useEffect(() => {
    // Use URLSearchParams API directly
    const p = searchParams.get('plan');
    const b = searchParams.get('billing');
    
    setPlan(p);
    setBilling(b);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Your Account</h1>
        <SignupForm plan={plan} billing={billing} />
      </div>
    </div>
  );
}
