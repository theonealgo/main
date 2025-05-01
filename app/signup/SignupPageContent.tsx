'use client';

import { useSearchParams } from 'next/navigation';
import SignupForm from '@/components/SignupForm';

export default function SignupPageClient() {
  const searchParams = useSearchParams();

  const rawPlan = searchParams?.get('plan');
  const rawBilling = searchParams?.get('billing');

  const validPlans = ['the_one_stock', 'the_one_elite', 'the_one_premium'];
  const plan = validPlans.includes(rawPlan ?? '') ? rawPlan! : 'the_one_stock';

  const validBilling = ['monthly', 'yearly'];
  const billing = validBilling.includes(rawBilling ?? '') ? rawBilling! : 'monthly';

  return <SignupForm plan={plan} billing={billing} />;
}
