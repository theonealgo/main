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
    // 1) Credentials (email/password + TV username)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        tradingViewUsername: { label: "TradingView Username", type: "text" },
        email:                { label: "Email",                type: "email" },
        password:             { label: "Password",             type: "password" },
      },
      async authorize(credentials) {
        // <-- NOTE: switched from /signup to /login
        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tradingViewUsername: credentials?.tradingViewUsername,
              email:                credentials?.email,
              password:             credentials?.password,
            }),
          }
        );
        if (!res.ok) return null;
        const { user } = await res.json();
        return user;
      },
    }),

    // 2) Google OAuth
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    // all auth actions (credentials & OAuth) land on your custom /auth
    signIn: "/auth",
    error:  "/auth?error=1",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
