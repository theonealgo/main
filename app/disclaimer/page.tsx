'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-cover bg-center gradient-border" style={{ backgroundImage: "url('/images/bground.jpg')" }}>
        <div className="absolute inset-0 video-fallback">
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
  Legal - Disclaimer
</motion.h1>
          </div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
          >
            Understand the risks and responsibilities when using our tools.
          </motion.p>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Disclaimer</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            The One Algo provides algorithmic trading indicators and strategies built on quantitative models. These tools are for informational and educational purposes only and do not constitute financial advice or investment recommendations.
          </p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Trading involves significant risk of loss and is not suitable for every investor. Past performance is not indicative of future results. By using The One Algo, you acknowledge that you are solely responsible for your trading decisions and outcomes.
          </p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            All scripts and strategies are invite-only and provided via TradingView. We do not make guarantees of profitability, and we encourage all users to test thoroughly and consult with a licensed financial advisor before using any tool for live trading.
          </p>
        </div>
      </section>
    </div>
  );
}