'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export default function DocumentationPage() {
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
              className="text-5xl md:text-7xl font-bold gradient-text"
            >
              Trade Documentation
              <br />
              <span className="text-white">Strategy Breakdowns</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Docs Content */}
      <section className="py-20 bg-gray-900 px-4">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Paper Trading Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-4">Paper Trading Results</h2>
            <Zoom>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-gray-800">
                <Image
                  src="/images/papertrading.png"
                  alt="Paper Trading Results"
                  fill
                  className="object-contain p-4"
                />
              </div>
            </Zoom>
            <div className="bg-black p-6 rounded-xl border border-gray-700 text-gray-300">
              <p>
                The last five trades displayed above were executed using <strong>The One Forex Indicator</strong>, resulting in five consecutive wins...
              </p>
            </div>
          </div>

          {/* SPY 15-Minute */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-4">SPY 15-Minute Entries</h2>
            <Zoom>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-gray-800">
                <Image
                  src="/images/theonestocks1588.png"  // Update with your new image source
                  alt="SPY 15-Min Chart"
                  fill
                  className="object-contain p-4"
                />
              </div>
            </Zoom>
            <div className="bg-black p-6 rounded-xl border border-gray-700 text-gray-300">
              <p>
                This SPY 15-minute chart highlights 84 trades executed using <strong>The One Stock Strategy</strong>. Out of those, 75 were winners...
              </p>
            </div>
          </div>

          {/* Forex Scalping Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-4">Forex 5 and 10-Minute Scalps</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {["theoneelitegbpusd1097.png", "theoneelite5mgbpusd95.png"].map((img, i) => (
                <Zoom key={i}>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-gray-800">
                    <Image
                      src={`/images/${img}`} // Replace with your updated image sources
                      alt={`Forex ${i === 0 ? "5-Min" : "10-Min"} Chart`}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                </Zoom>
              ))}
            </div>
            <div className="bg-black p-6 rounded-xl border border-gray-700 text-gray-300">
              <p>
                On the right, we’ve got the <strong>GBPUSD 5-minute strategy</strong> running 43 trades with a phenomenal 41 wins and only 2 losses...
              </p>
            </div>
          </div>

          {/* Weekly Performance */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-4">SPY Weekly Analysis</h2>
            <Zoom>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-gray-800">
                <Image
                  src="/images/spyweekly.png"  // Update with your new image source
                  alt="SPY Weekly Chart"
                  fill
                  className="object-contain p-4"
                />
              </div>
            </Zoom>
            <div className="bg-black p-6 rounded-xl border border-gray-700 text-gray-300">
              <p>
                The <strong>SPY Weekly chart</strong> using <strong>The One Strategy</strong> is nothing short of remarkable — 19 winning trades, 0 losses...
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}