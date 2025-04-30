'use client';

import { useEffect, useState } from 'react';
import SignupForm from '../../components/SignupForm';
import { useSearchParams } from 'next/navigation';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<string>(''); // Explicit string type
  const [billing, setBilling] = useState<string>(''); // Explicit string type

  useEffect(() => {
    // Remove unnecessary null check - searchParams is always available
    const p = searchParams.get('plan') || ''; // Ensure string fallback
    const b = searchParams.get('billing') || ''; // Ensure string fallback
    
    setPlan(p);
    setBilling(b);
  }, [searchParams]); // searchParams is dependency

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Your Account</h1>
        <SignupForm plan={plan} billing={billing} />
      </div>
    </div>
  );
}
