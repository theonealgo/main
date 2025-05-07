// lib/auth.ts
import { createClient } from "@supabase/supabase-js";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions, DefaultSession } from "next-auth";

// ─── Module Augmentation ───────────────────────────────────────────────────────
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase    = createClient(supabaseUrl, supabaseKey);

export const authOptions: AuthOptions = {
  adapter: SupabaseAdapter({ url: supabaseUrl, secret: supabaseKey }),

  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        tradingViewUsername: { label: "TradingView Username", type: "text" },
        plan:    { label: "Plan", type: "text" },
        billing: { label: "Billing", type: "text" },
      },
      async authorize(creds) {
        // 1) try fetch existing user
        let { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", creds!.email)
          .maybeSingle();
        if (error) return null;

        // 2) if not found, create with hashed password
        if (!user) {
          const bcrypt = await import("bcryptjs");
          const hashed = await bcrypt.hash(creds!.password, 10);
          const { data: newUser, error: insertErr } = await supabase
            .from("users")
            .insert({
              email: creds!.email,
              hashed_password: hashed,
              tradingview_username: creds!.tradingViewUsername,
              plan:    creds!.plan,
              billing: creds!.billing,
            })
            .single();
          if (insertErr || !newUser) return null;
          user = newUser;
        } else {
          // 3) if found, verify password
          const bcrypt = await import("bcryptjs");
          const valid = await bcrypt.compare(
            creds!.password,
            (user as any).hashed_password
          );
          if (!valid) return null;
        }

        // 4) attach extra props for callbacks/events
        (user as any).tradingViewUsername = creds!.tradingViewUsername!;
        (user as any).plan                = creds!.plan!;
        (user as any).billing             = creds!.billing!;
        return user;
      },
    }),

    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tradingViewUsername = (user as any).tradingViewUsername;
        token.plan                = (user as any).plan;
        token.billing             = (user as any).billing;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.tradingViewUsername = token.tradingViewUsername as string;
      session.user.plan                = token.plan as string;
      session.user.billing             = token.billing as string;
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },

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

  // ◀── Here we point NextAuth at our single "/auth" page
  pages:   { signIn: "/auth" },

  secret:  process.env.NEXTAUTH_SECRET,
};
