// app/signup/SignupPageContent.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import SignupForm from '@/components/SignupForm';
import Image from 'next/image';
import Link from 'next/link';

export default function SignupPageClient() {
  const searchParams = useSearchParams();
  
  // Existing plan/billing logic
  const rawPlan = searchParams?.get('plan');
  const rawBilling = searchParams?.get('billing');
  const validPlans = ['the_one_stock', 'the_one_elite', 'the_one_premium'];
  const plan = validPlans.includes(rawPlan ?? '') ? rawPlan! : 'the_one_stock';
  const validBilling = ['monthly', 'yearly'];
  const billing = validBilling.includes(rawBilling ?? '') ? rawBilling! : 'monthly';

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-black">
      {/* Left Column - Market Video */}
      <div className="relative hidden md:block"></div>
        
        <div className="relative z-10 p-12 h-full flex flex-col justify-between bg-gradient-to-t from-black via-transparent to-black">
          <Link href="/" className="mb-8 inline-block">
            <Image
              src="/images/theonelogo.png"
              alt="The One Logo"
              width={184}
              height={184}
              className="filter brightness-0 invert"
              priority
            />
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white space-y-6"
          >
            <h2 className="text-4xl font-bold">Professional Trading Suite</h2>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center gap-3">
                <CheckIcon /> SPY/QQQ Optimized Strategies
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon /> Forex Pair Analysis Tools
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon /> Real-time Chart Patterns
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Right Column - Form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-black"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Image
              src="/images/theonelogo.png"
              alt="Logo"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold mb-2 text-white">
              {plan.replace(/_/g, ' ').toUpperCase()}
            </h1>
            <p className="text-gray-400">Access institutional trading tools</p>
          </div>

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <SignupForm plan={plan} billing={billing} />
          </motion.div>

          <p className="text-center text-sm text-gray-400">
            Existing member?{' '}
            <Link href="/login" className="text-blue-400 hover:underline">
              Authenticate here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Reusable Check Icon Component
function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-green-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
