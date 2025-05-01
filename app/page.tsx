"use client";

import Link from "next/link";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function Home() {
  const performanceItems = [
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
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans">

      {/* HERO SECTION */}
      <section
        className="relative min-h-screen flex items-center px-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bground.jpg')" }}
      >
        <div className="relative z-10 max-w-6xl w-full pl-8 md:pl-16">
          <div className="text-left space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              One Signal.<br />
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Zero Noise.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
              Just signals that work, backed by real data in real time.
            </p>
            <div className="space-y-4">
              <Link
                href="/app/signup"
                className="bg-white text-black px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-200 transition inline-block"
              >
                Get Started for Free
              </Link>
              <p className="text-sm text-gray-400">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PERFORMANCE SECTION */}
      <section className="bg-black py-24 px-4 md:px-12">
        <div className="max-w-7xl mx-auto space-y-24">
          {performanceItems.map((item, i) => (
            <div key={i} className="space-y-8 group">
             <Zoom zoomMargin={40}>
  <div className="relative h-[600px] w-full">
    <img ... />
  </div>
</Zoom>
              <div className="px-4 space-y-4">
                <h3 className="text-3xl font-bold">{item.title}</h3>
                <p className="text-gray-300 text-lg">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE STATS SECTION */}
      <section className="bg-gradient-to-r from-gray-900 to-black py-24 px-4 md:px-12">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <h2 className="text-5xl font-bold text-white">Real Results. Real Time.</h2>
          <p className="text-xl text-gray-300">
            Our strategies are engineered for performance. See it live below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div className="p-8 rounded-xl bg-gray-800 shadow-lg">
              <h3 className="text-4xl font-bold text-green-400">98%</h3>
              <p className="mt-2 text-lg">Win Rate</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-800 shadow-lg">
              <h3 className="text-4xl font-bold text-green-400">4.36</h3>
              <p className="mt-2 text-lg">Profit Factor</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-800 shadow-lg">
              <h3 className="text-4xl font-bold text-green-400">30 Days</h3>
              <p className="mt-2 text-lg">Free Trial</p>
            </div>
          </div>

          <div className="mt-16">
            <Link
              href="/app/signup"
              className="bg-gradient-to-r from-blue-500 to-teal-400 px-8 py-4 rounded-full text-lg font-semibold text-black hover:opacity-90 transition"
            >
              Start Winning Today
            </Link>
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="relative bg-black py-24 px-4 md:px-12 overflow-hidden">
        <video
          src="/images/videos/market-chart.mp4"
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center text-white space-y-12">
          <h2 className="text-5xl font-bold">Trade with Confidence. Powered by Data.</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Harness the power of our proven trading strategies and make informed, data-driven decisions in real-time.
          </p>
        </div>
      </section>
    </div>
  );
}
