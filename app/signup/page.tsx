'use client';

import { useEffect, useState } from 'react';
import SignupForm from '../../components/SignupForm';

// Use Next.js' built-in type for searchParams
type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function SignupPage({ searchParams }: PageProps) {
  const [plan, setPlan] = useState<string | null>(null);
  const [billing, setBilling] = useState<string | null>(null);

  useEffect(() => {
    // Handle both string and array formats
    const getParam = (param: string | string[] | undefined) => {
      if (Array.isArray(param)) return param[0];
      return param || null;
    };

    setPlan(getParam(searchParams.plan));
    setBilling(getParam(searchParams.billing));
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
