'use client';

import { useEffect, useState } from 'react';
import SignupForm from '../../components/SignupForm';

export default function SignupPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const [plan, setPlan] = useState<string | null>(null);
  const [billing, setBilling] = useState<string | null>(null);

  useEffect(() => {
    // Handle both string and array parameter formats
    const getParam = (param: string | string[] | undefined) => {
      if (!param) return null;
      return Array.isArray(param) ? param[0] : param;
    };

    setPlan(getParam(searchParams.plan) ?? null);
    setBilling(getParam(searchParams.billing) ?? null);
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
