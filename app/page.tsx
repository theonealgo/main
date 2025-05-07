'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import 'react-medium-image-zoom/dist/styles.css';
import './zoom-overrides.css';

const Zoom = dynamic(() => import('react-medium-image-zoom'), { ssr: false });

export default function Home() {
  // Theme toggle
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Typewriter
  const fullText = 'One Signal.\nZero Noise.';
  const [typed, setTyped] = useState('');
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setTyped(fullText.slice(0, ++i));
      if (i >= fullText.length) clearInterval(iv);
    }, 100);
    return () => clearInterval(iv);
  }, []);

  // Back-to-top
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToPerf = () =>
    document.getElementById('performance')?.scrollIntoView({ behavior: 'smooth' });

  const performanceItems = [
    {
      src: '/images/theonestocks98.png',
      alt: 'SPY swing trading signals with 98% win rate',
      title: 'The One Stocks Swing Analyzer | 98% Win Rate on SPY Signals',
      desc: 'Real-time SPY swing trade alerts powered by The One Stocks algorithm, delivering a 98% historical win rate. Ideal for precision short-term entries and exits on the S&P 500 ETF.',
    },
    {
      src: '/images/theoneelite4h98.png',
      alt: '4-hour SPY swing strategy with 98% win rate',
      title: 'The One Elite 4-Hour SPY Strategy | 98% Win Rate Swing Trades',
      desc: 'Harness our 4-hour SPY liquidity and momentum signals to capture market swings with a 98% win rate, backed by rigorous backtesting on S&P 500 data.',
    },
    {
      src: '/images/theonestocks9897.png',
      alt: 'Multi-index strategy with 97% win rate',
      title: 'The One Stocks Multi-Index Analyzer | 97% Win Rate on SPY & Nasdaq',
      desc: 'Trade both SPY and Nasdaq with a unified algorithmic strategy that posts a 97% win rate across major equity indices, optimized for 1–4 hour timeframes.',
    },
    {
      src: '/images/theoneelitegbpusd1097.png',
      alt: 'GBP/USD forex strategy with 97% win rate',
      title: 'The One Elite Forex Signal for GBP/USD | 97% Win Rate on 1-Hour Chart',
      desc: 'Precision GBP/USD entry and exit signals on the 1-hour timeframe, delivering a 97% win rate. Perfect for forex traders seeking high-confidence, data-driven trades.',
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans relative">
      {/* Theme toggle */}
      <button
        onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        className="fixed top-4 right-4 z-20 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center px-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bground.jpg')" }}
      >
        <div className="relative z-10 max-w-6xl w-full pl-8 md:pl-16 space-y-4">
          {typed.split('\n').map((line, i) => (
            <h1 key={i} className="text-5xl md:text-7xl font-bold leading-tight">
              {line}
            </h1>
          ))}
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl">
            Just signals that work, backed by real data in real time.
          </p>
          <div className="space-y-2">
            <Link
              href="/auth?screen_hint=signup"
              className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold shadow hover:bg-gray-200 transition"
            >
              Get Started For Free
            </Link>
            <p className="text-sm text-gray-200">No credit card required</p>
          </div>
        </div>
        <button
          onClick={scrollToPerf}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-4xl animate-bounce text-gray-300"
          aria-label="Scroll to performance"
        >
          ↓
        </button>
      </section>

      {/* PERFORMANCE */}
      <section id="performance" className="bg-black py-24 px-4 md:px-12">
        <div className="max-w-7xl mx-auto space-y-24">
          {performanceItems.map((item, i) => (
            <div key={i} className="space-y-8 group">
              <Zoom zoomMargin={40}>
                <div className="relative h-[600px] w-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    quality={100}
                    priority
                    className="rounded-xl object-contain hover:shadow-xl transition-shadow"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
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

      {/* LIVE STATS */}
      <section className="bg-gradient-to-r from-gray-900 to-black py-24 px-4 md:px-12">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <h2 className="text-5xl font-bold">Real Results. Real Time.</h2>
          <p className="text-xl text-gray-300">
            Our strategies are engineered for performance. See it live below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <StatCard label="Win Rate" value="98%" colorClass="text-green-400" />
            <StatCard label="Profit Factor" value="4.36" colorClass="text-green-400" />
            <StatCard label="Free Trial" value="30 Days" colorClass="text-green-400" />
          </div>
          <Link
            href="/auth?screen_hint=signup"
            className="mt-16 inline-block bg-gradient-to-r from-blue-500 to-teal-400 px-8 py-4 rounded-full text-lg font-semibold text-black hover:opacity-90 transition"
          >
            Start Winning Today
          </Link>
        </div>
      </section>

      {/* VIDEO */}
      <section className="relative bg-black py-24 px-4 md:px-12 overflow-hidden">
        <video
          src="/images/videos/market-chart.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-auto rounded-2xl shadow-xl"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trade with Confidence. Powered by Data.
          </h2>
          <p className="text-lg md:text-xl max-w-4xl">
            Harness the power of our proven trading strategies and make informed,
            data-driven decisions in real time.
          </p>
        </div>
      </section>

      {/* BACK TO TOP */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-500 transition"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className="p-8 rounded-xl bg-gray-800 shadow-lg">
      <h3 className={`text-4xl font-bold ${colorClass}`}>{value}</h3>
      <p className="mt-2 text-lg">{label}</p>
    </div>
  );
}
