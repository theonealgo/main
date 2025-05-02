// app/layout.tsx

'use client';

import { usePathname } from 'next/navigation';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TheOneAlgo',
  description: 'Built with TradingView® technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" className="bg-black">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}

        {pathname === '/' && (
          <div className="video-container">
            <video
              src="/videos/your-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            />
          </div>
        )}
      </body>
    </html>
  );
}
