'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import SignupForm from '@/components/SignupForm';
import Image from 'next/image';
import Link from 'next/link';

export default function SignupPageClient() {
  const searchParams = useSearchParams();
  
  // Existing plan/billing logic remains the same
  const rawPlan = searchParams?.get('plan');
  const rawBilling = searchParams?.get('billing');
  const validPlans = ['the_one_stock', 'the_one_elite', 'the_one_premium'];
  const plan = validPlans.includes(rawPlan ?? '') ? rawPlan! : 'the_one_stock';
  const validBilling = ['monthly', 'yearly'];
  const billing = validBilling.includes(rawBilling ?? '') ? rawBilling! : 'monthly';

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Column - Visual Section */}
      <div className="relative hidden md:block bg-gradient-to-br from-blue-900 to-black">
        <div className="absolute inset-0 overflow-hidden opacity-90">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="/images/signup-poster.jpg"
          >
            <source src="/videos/market-analysis.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="relative z-10 p-12 text-white h-full flex flex-col justify-between">
          <Link href="/" className="mb-8 inline-block">
            <Image
              src="/images/logo-white.png"
              alt="Logo"
              width={160}
              height={48}
              priority
            />
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">Join 50,000+ Traders</h2>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center gap-3">
                <CheckIcon /> Institutional-grade analytics
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon /> Real-time market insights
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon /> Premium trading tools
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Right Column - Form Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-black"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              {plan === 'the_one_elite' ? 'Elite Membership' : 'Pro Membership'}
            </h1>
            <p className="text-gray-400">Create your account in 30 seconds</p>
          </div>

          {/* Animated Form Container */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <SignupForm plan={plan} billing={billing} />
          </motion.div>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:underline">
              Sign in
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
