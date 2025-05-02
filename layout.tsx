// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TheOneAlgo",
  description: "Built with TradingView® technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-white min-h-screen flex flex-col relative`}>
        {/* Global low-opacity background */}
        <div 
          className="fixed inset-0 z-0 opacity-20"
          style={{
            backgroundImage: "url('/images/bground.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        
        <div className="relative z-10">
          <Header />
          <main className="flex-grow w-full">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
