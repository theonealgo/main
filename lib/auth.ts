// lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";

export const authOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // your existing signup/login logic, e.g. call your `/api/auth/signup` endpoint
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signup`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();
        if (res.ok && user) return user;
        return null;
      },
    }),
    // add other providers here (Google, etc.) if you use them
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signup",      // match your new signup page
    error: "/signup?error", // redirect errors back there
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
