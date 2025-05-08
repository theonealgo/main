// lib/auth.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  providers: [
    // 1) Credentials (email/password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // call your signup endpoint (or login) here:
        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );
        const user = await res.json();
        if (res.ok && user) return user;
        return null;
      },
    }),

    // 2) Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    // send all sign-in calls (credentials & OAuth) to your /auth page
    signIn: "/auth",
    // error messages also land here
    error: "/auth?error=1",
  },

  // (optionally) you can add callbacks here to persist
  // tradingViewUsername, plan, etc. into the JWT/session
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
