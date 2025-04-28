'use client';

import { useSearchParams } from 'next/navigation';
import SignupForm from './SignupForm';

export default function PlanWrapper() {
  const searchParams = useSearchParams();
  const plan = searchParams?.get('plan') || 'the_one_stock';
  const billing = searchParams?.get('billing') || 'monthly';

  return <SignupForm plan={plan} billing={billing} />;
}
