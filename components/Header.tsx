'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <nav className="flex items-center gap-6 relative">
        {/* Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="text-sm text-white hover:text-teal-400 transition-colors px-3 py-2 rounded-md border border-gray-700 hover:border-teal-400"
          >
            Pages ▾
          </button>
          {open && (
            <div className="absolute right-0 mt-3 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-2 w-56">
              {[
                { href: '/', label: 'Home' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/signup', label: 'Signup' },
                { href: '/about', label: 'About' },
                { href: '/faq', label: 'FAQ' },
                { href: '/contact', label: 'Contact' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA Button */}
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
