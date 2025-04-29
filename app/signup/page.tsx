'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import SignupForm from '@/components/SignupForm';

export default function SignupPage() {
  const searchParams = useSearchParams();

  const [plan, setPlan] = useState('the_one_stock');
  const [billing, setBilling] = useState('monthly');

  useEffect(() => {
    // SAFETY CHECK: Make sure searchParams is not null before accessing it
    if (searchParams) {
      const planParam = searchParams.get('plan');
      const billingParam = searchParams.get('billing');

      if (planParam) setPlan(planParam);
      if (billingParam) setBilling(billingParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex bg-black text-white">
      <div className="hidden lg:block relative w-1/2">
        <Image
          src="/images/bground.jpg"
          alt="Trading Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 space-y-6">
        <SignupForm plan={plan} billing={billing} />
      </div>
    </div>
  );
}
