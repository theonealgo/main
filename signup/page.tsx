'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SignupForm from '../../../components/SignupForm';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState('the_one_stock');
  const [billing, setBilling] = useState('monthly');

  useEffect(() => {
    const p = searchParams.get('plan');
    const b = searchParams.get('billing');

    if (p) setPlan(p);
    if (b) setBilling(b);
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
