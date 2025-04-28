'use client';

import { useSearchParams } from 'next/navigation';
import SignupForm from '@/components/SignupForm'; // Correct path since it's in components

export default function SignupPage() {
  const searchParams = useSearchParams();
  const plan = searchParams?.get('plan') ?? 'the_one_stock';
  const billing = searchParams?.get('billing') ?? 'monthly';

  return (
    <SignupForm plan={plan} billing={billing} />
  );
}
