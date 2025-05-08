'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [openMenu, setOpenMenu] = useState<'product' | 'resources' | 'company' | ''>('');

  const menus = [
    {
      key: 'product' as const,
      label: 'Product',
      items: [
        { href: '/pricing', label: 'Pricing' },
        { href: '/features', label: 'Features' },
      ],
    },
    {
      key: 'resources' as const,
      label: 'Resources',
      items: [
        { href: '/documentation', label: 'Documentation' },
        { href: '/tutorials', label: 'Tutorials' },
      ],
    },
    {
      key: 'company' as const,
      label: 'Company',
      items: [
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
      ],
    },
  ];

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
      <nav className="flex items-center gap-6">
        {menus.map(({ key, label, items }) => (
          <div
            key={key}
            className="relative"
            onMouseEnter={() => setOpenMenu(key)}
            onMouseLeave={() => setOpenMenu('')}
          >
            <button className="hover:text-teal-400 transition">{label}</button>
            {openMenu === key && (
              <div className="absolute left-0 mt-2 w-40 bg-gray-900 rounded shadow-lg py-2 z-50">
                {items.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block px-4 py-2 hover:bg-gray-800"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Get Started CTA */}
        <Link
          href="/auth?screen_hint=signup"
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
}
