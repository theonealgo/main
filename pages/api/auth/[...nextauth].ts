// pages/api/auth/[...nextauth].ts

import NextAuth, { AuthOptions, DefaultSession, DefaultUser } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// 1️⃣ Module augmentation so TS knows about our extra field on Session.user,
//    on the NextAuth User, and on AdapterUser too
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      tradingview_username?: string;
    };
  }
  interface User extends DefaultUser {
    tradingview_username?: string;
  }
}
declare module "next-auth/adapters" {
  interface AdapterUser {
    tradingview_username?: string;
  }
}

// 2️⃣ Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: AuthOptions = {
  adapter: SupabaseAdapter({
    url:    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:                { label: "Email", type: "email" },
        password:             { label: "Password", type: "password" },
        tradingview_username: { label: "TradingView Username", type: "text" }
      },
      async authorize(creds) {
        if (!creds?.email || !creds.password || !creds.tradingview_username) {
          throw new Error("All fields are required");
        }
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", creds.email)
          .single();
        if (error) throw new Error(error.message);

        const valid = await bcrypt.compare(creds.password, user.password);
        if (!valid) throw new Error("Invalid credentials");
        if (user.tradingview_username !== creds.tradingview_username) {
          throw new Error("Invalid TradingView username");
        }
        return user;
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn:  "/auth/signin",
    newUser: "/auth/username-setup",
    error:   "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        const { data } = await supabase
          .from("users")
          .select("tradingview_username")
          .eq("id", user.id)
          .single();
        token.tradingview_username = data?.tradingview_username ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.tradingview_username = token.tradingview_username as string;
      return session;
    },
    async signIn({ account, user }) {
      // user here is User | AdapterUser, both now have tradingview_username
      if (account?.provider === "google" && !user.tradingview_username) {
        return "/auth/username-setup";
      }
      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET!,
};

export default NextAuth(authOptions);
