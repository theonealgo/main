// app/layout.tsx
import './styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'TheOneAlgo',
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
      </body>
    </html>
  );
}
