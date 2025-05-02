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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 text-white bg-black">
      {/* Left Info Panel */}
  <div
  className="hidden md:block bg-cover bg-center"
  style={{ backgroundImage: "url('/images/bground.jpg')" }}
></div> 
      </div>

      {/* Right Column - Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-black via-gray-900 to-black"
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
            <h1 className="text-3xl font-bold text-white mb-1">
              {plan.replace(/_/g, ' ').toUpperCase()}
            </h1>
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

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <CheckIcon />
      <span>{text}</span>
    </li>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-green-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
