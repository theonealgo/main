// lib/auth.ts
import { createClient } from "@supabase/supabase-js";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!     // service-role key for full CRUD
);

export const authOptions: AuthOptions = {
  adapter: SupabaseAdapter(supabase),

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
        // 1) fetch the user record (or create it) from your `users` table
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", creds!.email)
          .maybeSingle();

        if (error) return null;
        // 2) verify password (bcrypt.compare…) or create new user if you want self-signup
        //    then attach the extra fields:
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
    // Stash extra fields on token
    async jwt({ token, user }) {
      if (user) {
        token.tradingViewUsername = (user as any).tradingViewUsername;
        token.plan                = (user as any).plan;
        token.billing             = (user as any).billing;
      }
      return token;
    },
    // Expose them on session.user
    async session({ session, token }) {
      session.user.tradingViewUsername = token.tradingViewUsername as string;
      session.user.plan                = token.plan as string;
      session.user.billing             = token.billing as string;
      return session;
    },
    // After any login, send ’em to the dashboard
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },

  // When NextAuth creates a new user row, also upsert your “profiles” table
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
