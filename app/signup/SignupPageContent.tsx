// app/signup/page.tsx
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
    <>
      {/* Background is handled by layout.tsx */}
      
      {/* Main content area - now properly structured with header/main/footer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header is automatically included from layout.tsx */}
        
        <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl space-y-8 bg-gradient-to-br from-gray-900/90 to-black/90 p-8 sm:p-12 rounded-xl backdrop-blur-sm"
          >
            <div className="text-center">
              <Image
                src="/images/theonelogo.png"
                alt="Logo"
                width={120}
                height={120}
                className="mx-auto mb-6"
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
        </main>
        
        {/* Footer is automatically included from layout.tsx */}
      </div>
    </>
  );
}
