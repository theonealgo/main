'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center gradient-border"
        style={{ backgroundImage: "url('/images/bground.jpg')" }}
      >
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
              className="text-4xl sm:text-5xl md:text-7xl font-bold gradient-text"
            >
              Algorithmic Trading
              <br />
              <span className="text-white">Perfected</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
          >
            Institutional-grade strategies powered by quantitative analysis.
          </motion.p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">About The One Algo</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-8 rounded"></div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            The One Algo is designed for the next-generation trader, offering sophisticated, institutional-grade trading strategies with a focus on precision and reliability...
          </p>
        </div>
      </section>
    </div>
  );
}