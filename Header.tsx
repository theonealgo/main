'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center">
  <Image
    src="/images/theonelogo.png"
    alt="TheOneAlgo Logo"
    width={128}
    height={128}
    className="h-10 w-auto"
  />
</Link>

      {/* Navigation */}
      <nav className="flex items-center gap-6">
        <Link
          href="/pricing"
          className="text-sm text-white hover:text-teal-400 transition-colors"
        >
          Pricing
        </Link>
        <Link
          href="/signup"
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow hover:opacity-90 transition"
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
}