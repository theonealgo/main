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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-black text-white">
      {/* Left Panel - Background image without white overlay */}
      <div
        className="relative hidden md:flex items-center justify-center h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bground.jpg')",
          backgroundColor: 'transparent',
        }}
      >
        <Link href="/" className="block">
          <Image
            src="/images/theonelogo.png"
            alt="The One Logo"
            width={164}
            height={164}
            priority
          />
        </Link>
      </div>

      {/* Right Column - Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-gray-900 to-black"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Image
              src="/images/theonelogo.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            {/* Removed the "the one stocks" text */}
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
        </div>
      </motion.div>
    </div>
  );
}
