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
      {/* Low-opacity background covering entire page */}
      <div 
        className="fixed inset-0 z-0 opacity-20 bg-black"
        style={{
          backgroundImage: "url('/images/bground.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Main form area */}
        <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl lg:max-w-4xl space-y-8 bg-gradient-to-br from-gray-900/90 to-black/90 p-8 sm:p-12 rounded-xl backdrop-blur-sm border border-gray-800"
          >
            <div className="text-center">
              <Image
                src="/images/theonelogo.png"
                alt="Logo"
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
        </main>
      </div>
    </div>
  );
}
