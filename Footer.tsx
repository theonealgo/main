// app/components/Footer.tsx
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-700 px-6 py-10 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8 text-gray-300">
        {/* Product Column */}
        <div>
          <h4 className="text-white font-semibold mb-2">Product</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/features" className="hover:text-white">
                Features
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h4 className="text-white font-semibold mb-2">Resources</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/documentation" className="hover:text-white">
                Documentation
              </Link>
            </li>
            <li>
              <Link href="/tutorials" className="hover:text-white">
                Tutorials
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="text-white font-semibold mb-2">Company</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/legal" className="hover:text-white">
                Legal
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className="hover:text-white">
                Disclaimer
              </Link>
            </li>
          </ul>
        </div>

        {/* Logo and Disclaimer */}
        <div>
        <Link href="/" className="block mb-4">
  <Image
    src="/images/theonelogo.png"
    alt="TheOneAlgo Logo"
    width={128}
    height={128}
    className="h-10 w-auto"
  />
</Link>
          <p className="text-xs text-gray-500">
            Trading comes with risk. Past results do not promise future gains. 
            Our indicators are tools, not guarantees. Built with TradingView® technology.
          </p>
        </div>
      </div>
    </footer>
  );
}
