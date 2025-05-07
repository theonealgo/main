// lib/auth.ts
import { createClient } from "@supabase/supabase-js";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions, DefaultSession } from "next-auth";

// ─── Module Augmentation ───────────────────────────────────────────────────────
// Tell NextAuth about our extra fields on session.user and JWT
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      tradingViewUsername: string;
      plan: string;
      billing: string;
    };
  }

  interface JWT {
    tradingViewUsername: string;
    plan: string;
    billing: string;
  }
}
// ────────────────────────────────────────────────────────────────────────────────

// Supabase config values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// This client is used in authorize() & events
const supabase = createClient(supabaseUrl, supabaseKey);

export const authOptions: AuthOptions = {
  // Pass the config object, not the client instance
  adapter: SupabaseAdapter({
    url: supabaseUrl,
    secret: supabaseKey,
  }),

  providers: [
    // ————— Email/Password + TradingView Username + Plan/Billing —————
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        tradingViewUsername: {
          label: "TradingView Username",
          type: "text",
          placeholder: "yourTVusername",
        },
        plan: { label: "Plan", type: "text" },
        billing: { label: "Billing", type: "text" },
      },
      async authorize(creds) {
        // 1) fetch (or create) user in your `users` table
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", creds!.email)
          .maybeSingle();
        if (error || !user) return null;

        // 2) verify password (bcrypt.compare…) or handle signup logic here

        // 3) attach extra fields for callbacks/events
        user.tradingViewUsername = creds!.tradingViewUsername!;
        user.plan                = creds!.plan!;
        user.billing             = creds!.billing!;
        return user;
      },
    }),

    // ————— Google OAuth —————
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Persist extra fields into the JWT
    async jwt({ token, user }) {
      if (user) {
        token.tradingViewUsername = (user as any).tradingViewUsername;
        token.plan                = (user as any).plan;
        token.billing             = (user as any).billing;
      }
      return token;
    },
    // Expose them in session.user
    async session({ session, token }) {
      session.user.tradingViewUsername = token.tradingViewUsername as string;
      session.user.plan                = token.plan as string;
      session.user.billing             = token.billing as string;
      return session;
    },
    // Send everyone to /dashboard after login
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },

  // Upsert your profiles table when a new user is created
  events: {
    async createUser({ user }) {
      await supabase.from("profiles").upsert({
        id: user.id,
        tradingview_username: (user as any).tradingViewUsername || null,
        plan:                (user as any).plan,
        billing:             (user as any).billing,
      });
    },
  },

  session: { strategy: "jwt" },
  pages:   { signIn: "/signin" },
  secret:  process.env.NEXTAUTH_SECRET,
};
