// app/signup/SignupPageContent.tsx

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";

export default function SignupPageContent() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 text-white bg-black">
      {/* Left Image Panel */}
      <div
        className="hidden md:block bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bground.jpg')" }}
      ></div>

      {/* Right Column - Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center p-8 space-y-6"
      >
        <Link href="/" className="block mb-6">
          <Image
            src="/images/theonelogo.png"
            alt="The One Logo"
            width={164}
            height={164}
            className="filter brightness-0 invert"
            priority
          />
        </Link>

        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </motion.div>
    </div>
  );
}
