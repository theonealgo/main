'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      </div>
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
      import React from 'react';

export default function AboutPage() {
  return (
    <div className="about-page-container">
      <section className="about-section py-16 px-6">
        <h1 className="text-4xl font-bold mb-6">The One Algo — Empowering Traders with Precision & Innovation</h1>
        
        <p className="text-lg mb-6">
          At <strong>The One Algo</strong>, we’re reshaping the way traders and investors approach the market. Our focus is to provide 
          <strong> next-level trading strategies</strong> that combine <strong>sophistication</strong>, <strong>precision</strong>, and <strong>reliability</strong>, 
          designed to suit the needs of both <strong>novices</strong> and <strong>experienced traders</strong>.
        </p>

        <p className="text-lg mb-6">
          We are a <strong>leader</strong> in the world of TradingView’s community indicators, offering <strong>innovative and high-quality tools</strong> 
          that cater to a broad range of trading strategies and market conditions. Our indicators and tools are designed to help you navigate the 
          complexities of the market with greater clarity and confidence.
        </p>

        <p className="text-lg mb-6">
          We believe that <strong>transparency</strong> is key in an industry often filled with confusion and unsubstantiated claims. We don’t play games, 
          and we don’t overcomplicate things. Our mission is simple: <strong>share powerful tools</strong> and <strong>insightful strategies</strong> that 
          actually work. No tricks, no false promises, just <strong>genuine expertise</strong> rooted in years of experience as both developers and traders.
        </p>

        <p className="text-lg mb-6">
          Whether you're trading stocks or forex, our <strong>cutting-edge indicators</strong> give you a clear edge in understanding market trends and 
          making informed decisions. We give you the tools to take control of your trading, helping you identify opportunities, manage risks, and ultimately, 
          <strong>improve your profitability</strong>.
        </p>

        <p className="text-lg mb-6">
          Our commitment to transparency means we open-source the majority of our work, making <strong>hundreds of indicators</strong> and tools freely 
          available for anyone to use and improve. For those who want the absolute best, our exclusive <strong>premium indicators</strong> offer even more 
          advanced insights and features, designed for those who are serious about trading.
        </p>
      </section>
    </div>
  );
}
  );
}
