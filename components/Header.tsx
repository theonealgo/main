'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="w-full bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between shadow-sm relative z-50">
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
      <nav className="flex items-center gap-4 relative">
        {/* Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-sm text-white hover:text-teal-400 transition-colors"
          >
            Menu ▾
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-2 w-48 z-50">
              <Link
                href="/"
                className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                Contact
              </Link>
            </div>
          )}
        </div>

        {/* Get Started Button */}
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
