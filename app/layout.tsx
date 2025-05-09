//layout.tsx
import './styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
// switch to the React entrypoint for SpeedInsights:
import { SpeedInsights } from '@vercel/speed-insights/react';

export const metadata = {
  title: 'The One Algo',
  description: 'Built with TradingView® technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-black">
      <body className="antialiased text-white flex flex-col min-h-screen">
        <Header />

        {/* push content below fixed header */}
        <main className="flex-grow pt-16">
          {children}
        </main>

        <Footer />

        {/* Vercel Speed Insights widget */}
        <SpeedInsights />
      </body>
    </html>
  );
}
