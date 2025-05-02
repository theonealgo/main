'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const pricingPlans = [
    {
      title: "The One Stocks",
      price: billingCycle === 'monthly' ? 49.99 : 499.90,
      description: "Swing trade strategy for SPY & NASDAQ with 90%+ win rate and high profit factor.",
      features: [
        "Best for 1hr–Daily timeframes",
        "SPY & NASDAQ focus",
        "2.2+ profit factor",
        "Real-time entry/exit alerts",
      ],
      planKey: 'the_one_stocks',
      image: '/images/theonestockssettings.png'
    },
    {
      title: "The One Elite",
      price: billingCycle === 'monthly' ? 59.99 : 599.90,
      description: "Intraday strategy optimized for GBP/USD & SPY with 97% win rate and superior profit factor.",
      features: [
        "Best for 15min–4hr timeframes",
        "GBP/USD + SPY focus",
        "2.9+ profit factor",
        "Real-time entry/exit alerts",
      ],
      planKey: 'the_one_elite',
      image: '/images/theoneelitesettings.png'
    },
    {
      title: "The One Premium",
      price: billingCycle === 'monthly' ? 99.99 : 999.90,
      description: "All strategies included — Stocks and Elite — full trading coverage.",
      features: [
        "Stocks + Elite strategies access",
        "All timeframes supported",
        "Advanced risk management tools",
      ],
      planKey: 'the_one_premium',
      image: '/images/trading.jpeg'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Background Section */}
      <div className="fixed inset-0 z-0 opacity-20">
        <Image
          src="/images/bground.jpg"
          alt="Market background"
          fill
          className="object-cover"
          quality={100}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent"
          >
            Pricing Plans
          </motion.h1>
          <p className="text-gray-400 text-xl mb-8">Choose your trading advantage</p>

          {/* Billing Toggle */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mb-12"
          >
            <div className="bg-gray-900 p-1 rounded-full flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  billingCycle === 'monthly' 
                    ? 'bg-teal-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  billingCycle === 'yearly' 
                    ? 'bg-teal-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.planKey}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-900 rounded-xl p-8 border border-gray-800 hover:border-teal-400 transition-all relative overflow-hidden"
              >
                {/* Strategy Preview */}
                <div className="mb-6 -mx-8 -mt-8">
                  <Image
                    src={plan.image}
                    alt={plan.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <div className="mb-8">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400 ml-2">/{billingCycle}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <span className="text-teal-400 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/signup?plan=${plan.planKey}&billing=${billingCycle}`}
                  className="block w-full bg-gradient-to-r from-blue-500 to-teal-500 text-center text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Start Free Trial
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-16 text-center border-t border-gray-800 pt-12"
        >
          <div className="mb-6">
            <Image
              src="/images/paymentmethod.svg"
              alt="Payment Methods"
              width={300}
              height={40}
              className="mx-auto"
            />
          </div>
          <p className="text-gray-400 text-sm">
            256-bit SSL Encryption • Cancel Anytime • 30-Day Money Back Guarantee
          </p>
        </motion.div>
      </div>
    </div>
  );
}
