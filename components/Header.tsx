'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string>('');
  const toggleMenu = (menu: string) =>
    setOpenMenu(openMenu === menu ? '' : menu);

  return (
    <header className="w-full bg-black text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/images/theonelogo.png"
          alt="Logo"
          width={128}
          height={128}
          className="h-10 w-auto"
        />
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-6 relative">
        {/* Product Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('product')}
            className="hover:text-teal-400 transition"
          >
            Product
          </button>
          {openMenu === 'product' && (
            <div className="absolute left-0 mt-2 w-40 bg-gray-900 rounded shadow-lg py-2 z-50">
              <Link href="/pricing" className="block px-4 py-2 hover:bg-gray-800">
                Pricing
              </Link>
              <Link href="/features" className="block px-4 py-2 hover:bg-gray-800">
                Features
              </Link>
            </div>
          )}
        </div>

        {/* Resources Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('resources')}
            className="hover:text-teal-400 transition"
          >
            Resources
          </button>
          {openMenu === 'resources' && (
            <div className="absolute left-0 mt-2 w-40 bg-gray-900 rounded shadow-lg py-2 z-50">
              <Link
                href="/documentation"
                className="block px-4 py-2 hover:bg-gray-800"
              >
                Documentation
              </Link>
              <Link href="/tutorials" className="block px-4 py-2 hover:bg-gray-800">
                Tutorials
              </Link>
            </div>
          )}
        </div>

        {/* Company Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('company')}
            className="hover:text-teal-400 transition"
          >
            Company
          </button>
          {openMenu === 'company' && (
            <div className="absolute left-0 mt-2 w-40 bg-gray-900 rounded shadow-lg py-2 z-50">
              <Link href="/about" className="block px-4 py-2 hover:bg-gray-800">
                About
              </Link>
              <Link href="/contact" className="block px-4 py-2 hover:bg-gray-800">
                Contact
              </Link>
            </div>
          )}
        </div>

        {/* Get Started CTA */}
        <Link
          href="/auth?screen_hint=signup"
          className="
            bg-gradient-to-r from-blue-500 to-teal-500
            px-5 py-2 rounded-full text-sm font-semibold
            shadow hover:opacity-90 transition
          "
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
}
