'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export default function TutorialsPage() {
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
                alt="The One Logo"
                width={184}
                height={184}
                className="mr-8 cursor-pointer hover:opacity-90 transition-opacity"
                priority
              />
            </Link>
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl md:text-7xl font-bold gradient-text"
            >
              Tutorials & Setup
              <br />
              <span className="text-white">Getting Started</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Tutorial Steps */}
      <section className="py-20 bg-gray-900 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Step 1 */}
          <div>
            <h2 className="text-3xl font-bold mb-4">1. Access the Indicator</h2>
            <p className="text-gray-300">
              To begin, ensure you have access to <strong>The One</strong> indicator on TradingView. 
              If you haven't received an invitation, please contact support to request access.
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <h2 className="text-3xl font-bold mb-4">2. Add the Indicator to Your Chart</h2>
            <p className="text-gray-300">
              Once access is granted, navigate to the TradingView chart, click on "Indicators," 
              and search for <strong>The One</strong>. Click to add it to your chart.
            </p>
          </div>

          {/* Step 3 */}
          <div>
            <h2 className="text-3xl font-bold mb-4">3. Understand the Indicator Components</h2>
            <p className="text-gray-300">
              Familiarize yourself with the various components of <strong>The One</strong> indicator, 
              including entry signals, stop-loss levels, and take-profit targets. 
              Refer to the documentation for detailed explanations.
            </p>
          </div>

          {/* Step 4 - Optimized Image Section */}
          <div>
            <h2 className="text-3xl font-bold mb-4">4. Apply the Recommended Settings</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 py-10">
              <div className="max-w-md text-center">
                <Zoom
                  zoomMargin={40}
                  ZoomContent={({ img }) => (
                    <div style={{ 
                      backgroundColor: 'rgba(0,0,0,0.95)',
                      zIndex: 1000
                    }}>
                      {img}
                    </div>
                  )}
                >
                  <div className="relative h-[600px] w-full">
                    <Image
                      src="/images/theonestockssettings.png"
                      alt="The One Stocks Settings - HD Configuration"
                      fill
                      quality={100}
                      priority
                      className="rounded-xl object-contain hover:shadow-xl transition-shadow"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                      style={{
                        imageRendering: 'crisp-edges',
                      }}
                    />
                  </div>
                </Zoom>
                <p className="mt-4 text-gray-300">
                  These are the recommended settings for <strong>The One Stocks</strong> indicator. 
                  Apply the settings exactly as shown for optimal performance on U.S. stocks like SPY, QQQ, 
                  and major large-caps.
                </p>
              </div>
              <div className="max-w-md text-center">
                <Zoom
                  zoomMargin={40}
                  ZoomContent={({ img }) => (
                    <div style={{ 
                      backgroundColor: 'rgba(0,0,0,0.95)',
                      zIndex: 1000
                    }}>
                      {img}
                    </div>
                  )}
                >
                  <div className="relative h-[600px] w-full">
                    <Image
                      src="/images/theoneelitesettings.png"
                      alt="The One Elite Settings - HD Configuration"
                      fill
                      quality={100}
                      priority
                      className="rounded-xl object-contain hover:shadow-xl transition-shadow"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                      style={{
                        imageRendering: 'crisp-edges',
                      }}
                    />
                  </div>
                </Zoom>
                <p className="mt-4 text-gray-300">
                  These settings are for <strong>The One Elite</strong> indicator, fine-tuned for SPY, QQQ, 
                  and pairs like GBPUSD and EURUSD. They're compatible with all time frames, but results can vary 
                  depending on volatility and market sessions.
                </p>
              </div>
            </div>
            <p className="text-md text-gray-400 text-center italic mt-4">
              Note: Click and hold to zoom. Images are in 4K resolution for maximum clarity.
            </p>
          </div>

          {/* Step 5 */}
          <div>
            <h2 className="text-3xl font-bold mb-4">5. Backtest the Strategy</h2>
            <p className="text-gray-300">
              Before going live, backtest <strong>The One Stocks</strong> indicator on historical data 
              to understand its performance. Use TradingView's built-in backtesting tools to simulate 
              trades and assess profitability.
            </p>
          </div>

          {/* Step 6 */}
          <div>
            <h2 className="text-3xl font-bold mb-4">6. Start Paper Trading</h2>
            <p className="text-gray-300">
              Begin paper trading using <strong>The One</strong> indicator to practice without risking real capital. 
              Monitor your trades, refine your strategy, and build confidence before transitioning to live trading.
            </p>
          </div>

          {/* Step 7 */}
          <div>
            <h2 className="text-3xl font-bold mb-4">7. Selling at Tape Profit Levels</h2>
            <div className="text-gray-300">
              <p className="mb-4">
                Unlock Accurate Trading with <strong>The One Stocks</strong> and <strong>The One Elite</strong> Indicators
                When you use <strong>The One Stocks</strong> or <strong>The One Elite</strong> indicators, 
                you'll notice a critical advantage: no repainting. Unlike most indicators, which often adjust 
                their buy and sell signals to the top or bottom of an apex, our signals remain fixed, offering 
                you more reliable and consistent entry and exit points.
              </p>
              <p className="mb-4">
                Our indicators provide you with clear, actionable signals that stay in place, ensuring that 
                your trades are based on real-time data you can trust. For optimal performance:
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li className="mb-2">
                  <strong>Take Profit:</strong> Consider selling when the price reaches a higher high level, 
                  and the indicator confirms a take profit signal.
                </li>
                <li>
                  <strong>Buy Signals:</strong> Only consider buy signals at higher high levels if you have 
                  significant trading experience, as these situations can be more volatile and complex.
                </li>
              </ul>
              <p className="mt-4">
                Maximize your trading potential with indicators designed for accuracy and consistency. 
                Whether you're new to trading or a seasoned pro, <strong>The One Stocks</strong> and 
                <strong>The One Elite</strong> will give you a clear edge in the market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Zoom Styles */}
      <style jsx global>{`
        .zoom-overlay {
          background: rgba(0, 0, 0, 0.95) !important;
        }
        .zoom-image {
          cursor: zoom-out !important;
          image-rendering: crisp-edges !important;
        }
      `}</style>
    </div>
  );
}
