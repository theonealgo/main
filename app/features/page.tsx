'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center gradient-border"
        style={{ backgroundImage: "url('/images/bground.jpg')" }}
      >
        <div className="relative z-10 text-left px-4 max-w-6xl">
          <div className="flex items-center mb-12">
            <Link href="/">
              <Image
                src="/images/theonelogo.png"
                alt="Logo"
                width={184}
                height={184}
                className="mr-8 cursor-pointer"
              />
            </Link>
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl md:text-7xl font-bold gradient-text"
            >
              Our Features
            </motion.h1>
          </div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
          >
            Discover what makes our indicators unique, effective, and built for serious traders.
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              title: 'Institutional-Grade Logic',
              text: 'Our indicators use custom-built algorithms tested across thousands of data points to identify real edge — not just signals based on laggy indicators.',
            },
            {
              title: 'Live Alerts on TradingView',
              text: 'Receive alerts on your phone or desktop the moment a trade setup occurs. You’ll never miss a key opportunity.',
            },
            {
              title: 'Multi-Timeframe Flexibility',
              text: 'Works on 5min, 15min, 1H, and 4H charts across stocks and forex pairs. Whether you’re scalping or swing trading — we’ve got you covered.',
            },
            {
              title: 'Invite-Only Secure Scripts',
              text: 'Our indicators are protected and secure — we don’t publish them to the public, and access is only granted to verified users.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700"
            >
              <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Image Showcase */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Visual Signals In Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                src: "/images/theonestocks98.png",
                alt: "98-Minute Chart, 98% Win Rate",
                title: "98-Minute Trading Strategy | 98% Win Rate on SPY - High-Precision Short-Term Trades",
                desc: "Maximize your profits with the 98-minute trading strategy, delivering an impressive 98% win rate for short-term traders. Perfect for those looking to enter and exit the market with precision, ensuring high-quality, profitable trades."
              },
              {
                src: "/images/theoneelite4h98.png",
                alt: "4-Hour Chart, 98% Win Rate",
                title: "4-Hour Swing Strategy | 98% Win Rate on SPY - Consistent Profits for Swing Traders",
                desc: "Leverage the power of the 4-hour chart with a proven 98% win rate, ideal for swing traders seeking consistency and precision. Achieve profitable trades over longer timeframes with a strategy designed for sustained growth."
              },
              {
                src: "/images/theonestocks9897.png",
                alt: "97-Minute Chart, 97% Win Rate",
                title: "97-Minute Trading Strategy | 97% Win Rate on SPY - High-Precision Short-Term Trades",
                desc: "Unlock high-precision trading with the 97-minute strategy, offering a 97% win rate. Perfect for traders looking to capitalize on fast market movements with minimal risk and maximum reward."
              },
              {
                src: "/images/theoneelitegbpusd1097.png",
                alt: "GBP/USD 10 Minute Chart, 97% Win Rate",
                title: "GBP/USD 10 Minute Forex Strategy | 97% Win Rate - Precision Trading for Maximum Profit",
                desc: "Profit from real-time Forex market movements with the GBP/USD 10 minute strategy, proven to deliver a 97% win rate. Perfect for precision traders targeting the most profitable currency pairs."
              }
            ].map((imgData, idx) => (
              <div
                key={idx}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4"
              >
                <Image
                  src={imgData.src}
                  alt={imgData.alt}
                  width={600}
                  height={400}
                  className="w-full h-auto rounded"
                />
                <h3 className="text-xl text-white mt-4">{imgData.title}</h3>
                <p className="text-gray-400 mt-2">{imgData.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Settings Section */}
      <section className="py-20 bg-gray-900">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-white mb-8">Adjustable Settings</h2>
    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
      Our indicators offer highly customizable inputs to match your trading strategy. Here's a breakdown of the key settings:
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
      {[
        { label: 'Liquidity Base Period', value: '1750' },
        { label: 'ATR Length', value: '4' },
        { label: 'ATR Breakout Threshold', value: '7.3' },
        { label: 'Take-Profit Multiplier', value: '3.25' },
        { label: 'Stop-Loss Multiplier', value: '4.75' },
      ].map((setting, idx) => (
        <div
          key={idx}
          className={`${
            setting.label === 'Stop-Loss Multiplier' ? 'col-span-2' : ''
          } bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex justify-center items-center`}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold">{setting.label}</h3>
            <p className="text-gray-300">{setting.value}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
    </div>
  );
}
