'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import SignupForm from '@/components/SignupForm';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

export default function SignupPageClient() {
  const searchParams = useSearchParams();

  const plan = useMemo(() => {
    const rawPlan = searchParams.get('plan');
    const validPlans = ['the_one_stocks', 'the_one_elite', 'the_one_premium'] as const;
    return validPlans.includes(rawPlan as typeof validPlans[number]) ? rawPlan! : 'the_one_stocks';
  }, [searchParams]);

  const billing = useMemo(() => {
    const rawBilling = searchParams.get('billing');
    const validBilling = ['monthly', 'yearly'] as const;
    return validBilling.includes(rawBilling as typeof validBilling[number]) ? rawBilling! : 'monthly';
  }, [searchParams]);

  return (
    <div className="flex-grow flex items-center justify-center p-4 sm:p-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl lg:max-w-4xl space-y-8 bg-gradient-to-br from-gray-900/90 to-black/90 p-8 sm:p-12 rounded-xl backdrop-blur-sm border border-gray-800"
      >
        <div className="text-center">
          <Image
            src="/images/theonelogo.png"
            alt="TheOne Logo"
            width={140}
            height={140}
            className="mx-auto mb-6"
            priority
          />
          <p className="text-sm text-gray-400 mb-2">
            Access institutional-grade tools
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SignupForm plan={plan} billing={billing} />
        </motion.div>

        <p className="text-center text-sm text-gray-400 pt-4">
          Already a member?{' '}
          <Link 
            href="/login" 
            className="text-blue-400 hover:underline hover:text-blue-300 transition-colors"
          >
            Authenticate here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
