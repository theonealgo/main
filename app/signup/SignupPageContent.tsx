'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import SignupForm from '@/components/SignupForm';
import Image from 'next/image';
import Link from 'next/link';

export default function SignupPageClient() {
  const searchParams = useSearchParams();

  const rawPlan = searchParams?.get('plan');
  const rawBilling = searchParams?.get('billing');
  const validPlans = ['the_one_stocks', 'the_one_elite', 'the_one_premium'];
  const plan = validPlans.includes(rawPlan ?? '') ? rawPlan! : 'the_one_stocks';
  const validBilling = ['monthly', 'yearly'];
  const billing = validBilling.includes(rawBilling ?? '') ? rawBilling! : 'monthly';

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background image covering entire page with low opacity */}
      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('/images/bground.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Form content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md space-y-8 bg-gradient-to-br from-gray-900/90 to-black/90 p-8 rounded-xl backdrop-blur-sm"
        >
          <div className="text-center">
            <Image
              src="/images/theonelogo.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            <p className="text-sm text-gray-400">
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

          <p className="text-center text-sm text-gray-400">
            Already a member?{' '}
            <Link href="/login" className="text-blue-400 hover:underline">
              Authenticate here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
