'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center gradient-border"
        style={{ backgroundImage: "url('/images/bground.jpg')" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover opacity-30"
            src="/images/videos/market-chart.mp4"
          />
        </div>
        <div className="relative z-10 text-left px-4 max-w-6xl">
          <div className="flex items-center mb-12">
            <Link href="/">
              <Image
                src="/images/theonelogo.png"
                alt="The One Logo"
                width={184}
                height={184}
                className="mr-8 cursor-pointer"
                priority
              />
            </Link>
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl md:text-7xl font-bold gradient-text"
            >
              Legal Information
              <br />
              <span className="text-white">Terms & Policies</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Legal Content */}
      <section className="py-20 bg-gray-900 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Terms of Service */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Terms of Service</h2>
            <div className="space-y-4 text-gray-300">
              <p>Last Updated: [Date]</p>
              
              <h3 className="text-xl font-semibold mt-6">1. Acceptance of Terms</h3>
              <p>By accessing or using The One trading indicators ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part, you may not access the Service.</p>

              <h3 className="text-xl font-semibold mt-6">2. License Grant</h3>
              <p>Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable license to use our trading indicators for personal, non-commercial purposes.</p>

              <h3 className="text-xl font-semibold mt-6">3. Prohibited Uses</h3>
              <p>You may not reverse engineer, modify, distribute, or create derivative works based on our indicators. Commercial use requires explicit written permission.</p>
            </div>
          </div>

          {/* Privacy Policy */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
            <div className="space-y-4 text-gray-300">
              <h3 className="text-xl font-semibold">1. Information Collection</h3>
              <p>We collect minimal personal data including email addresses and usage statistics to improve our services.</p>

              <h3 className="text-xl font-semibold mt-6">2. Data Protection</h3>
              <p>Your data is protected using industry-standard security measures. We never sell your personal information to third parties.</p>

              <h3 className="text-xl font-semibold mt-6">3. Cookies</h3>
              <p>We use essential cookies for site functionality. Third-party cookies are only used with your explicit consent.</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Trading Disclaimer</h2>
            <div className="space-y-4 text-gray-300">
              <p>The One indicators are educational tools only. Past performance does not guarantee future results. Trading financial instruments carries substantial risk of loss. We are not responsible for any trading decisions made using our indicators.</p>
              <p>Always consult with a qualified financial advisor before making any investment decisions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}