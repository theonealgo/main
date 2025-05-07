'use client';
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="p-8 max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Sign In</h1>

      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full py-3 border rounded hover:bg-gray-100"
      >
        Sign in with Google
      </button>

      <button
        onClick={() => signIn("credentials", { callbackUrl: "/dashboard" })}
        className="w-full py-3 bg-blue-600 text-white rounded"
      >
        Sign in with Email
      </button>
    </div>
  );
}
