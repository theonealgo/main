// components/Header.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string>('');

  return (
    <header className="fixed top-0 w-full bg-black text-white border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/images/theonelogo.png" alt="Logo" width={40} height={40} />
        </Link>

        <nav className="flex items-center gap-6 relative">
          {['product','resources','company'].map(menu => (
            <div
              key={menu}
              className="relative"
              onMouseLeave={() => setOpenMenu('')}
            >
              <button
                onMouseEnter={() => setOpenMenu(menu)}
                className="hover:text-teal-400 transition"
              >
                {menu.charAt(0).toUpperCase() + menu.slice(1)}
              </button>
              {openMenu === menu && (
                <div className="absolute left-0 mt-2 w-40 bg-gray-900 rounded shadow-lg py-2">
                  {(menu === 'product'
                    ? [['Pricing','/pricing'], ['Features','/features']]
                    : menu === 'resources'
                    ? [['Documentation','/documentation'], ['Tutorials','/tutorials']]
                    : [['About','/about'], ['Contact','/contact']]
                  ).map(([label, href]) => (
                    <Link key={href} href={href} className="block px-4 py-2 hover:bg-gray-800">
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link
            href="/auth?screen_hint=signup"
            className="bg-gradient-to-r from-blue-500 to-teal-500 px-5 py-2 rounded-full text-sm font-semibold shadow hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
