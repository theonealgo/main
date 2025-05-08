'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const [openMenu, setOpenMenu] = useState<''|'product'|'resources'|'company'>('');
  const closeMenu = () => setOpenMenu('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <header className="w-full bg-black text-white px-6 py-4 flex items-center justify-between border-b border-gray-800 fixed top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image src="/images/theonelogo.png" alt="Logo" width={40} height={40} />
        <span className="ml-2 font-bold">TheOneAlgo</span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-6 relative">
        {(['product','resources','company'] as const).map(menu => (
          <div
            key={menu}
            onMouseLeave={closeMenu}
            className="relative"
          >
            <button
              onClick={()=>setOpenMenu(openMenu===menu?'':menu)}
              className="hover:text-teal-400 transition"
            >
              {menu.charAt(0).toUpperCase()+menu.slice(1)}
            </button>
            {openMenu===menu && (
              <div className="absolute left-0 mt-2 w-40 bg-gray-900 rounded shadow-lg py-2 z-50">
                {menu==='product' && <>
                  <Link href="/pricing" className="block px-4 py-2 hover:bg-gray-800">Pricing</Link>
                  <Link href="/features" className="block px-4 py-2 hover:bg-gray-800">Features</Link>
                </>}
                {menu==='resources' && <>
                  <Link href="/documentation" className="block px-4 py-2 hover:bg-gray-800">Documentation</Link>
                  <Link href="/tutorials" className="block px-4 py-2 hover:bg-gray-800">Tutorials</Link>
                </>}
                {menu==='company' && <>
                  <Link href="/about" className="block px-4 py-2 hover:bg-gray-800">About</Link>
                  <Link href="/contact" className="block px-4 py-2 hover:bg-gray-800">Contact</Link>
                </>}
              </div>
            )}
          </div>
        ))}

        {/* CTA or User */}
        {session?.user ? (
          <div className="flex items-center gap-4">
            <span>Hello, {session.user.name || session.user.email}</span>
            <button onClick={()=>signOut()} className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">Sign Out</button>
          </div>
        ) : (
          <Link
            href="/signup"
            className="bg-gradient-to-r from-blue-500 to-teal-400 px-5 py-2 rounded-full text-sm font-semibold shadow hover:opacity-90 transition"
          >
            Get Started
          </Link>
        )}
      </nav>
    </header>
  );
}
