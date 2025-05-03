'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="text-sm text-white hover:text-teal-400 transition-colors flex items-center gap-1"
          >
            Menu
            <svg
              className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-md shadow-lg py-1 z-50">
              <Link
                href="/pricing"
                className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                onClick={toggleMenu}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                onClick={toggleMenu}
              >
                About Us
              </Link>
              <Link
                href="/features"
                className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                onClick={toggleMenu}
              >
                Features
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <Link
                href="/blog"
                className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                onClick={toggleMenu}
              >
                Blog
              </Link>
            </div>
          )}
        </div>

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
