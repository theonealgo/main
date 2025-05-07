// lib/auth.ts
import { createClient } from "@supabase/supabase-js";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions, DefaultSession } from "next-auth";

// ─── Module augmentation so NextAuth’s Session & JWT carry our extra fields ───
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

// Create a Supabase client with service‐role key (full CRUD) for your adapter & events
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase    = createClient(supabaseUrl, supabaseKey);

export const authOptions: AuthOptions = {
  adapter: SupabaseAdapter({ url: supabaseUrl, secret: supabaseKey }),

  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email:              { label: "Email",              type: "text"     },
        password:           { label: "Password",           type: "password" },
        tradingViewUsername:{ label: "TradingView Username",type: "text"     },
        plan:               { label: "Plan",               type: "text"     },
        billing:            { label: "Billing",            type: "text"     },
      },
      async authorize(creds) {
        // 1) lookup by email
        let { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", creds!.email)
          .maybeSingle();
        if (error) return null;

        // 2) if not found, hash & insert (signup)
        if (!user) {
          const { hash } = await import("bcryptjs").then(b => ({ hash: (pw: string) => b.hash(pw, 10) }));
          const hashed    = await hash(creds!.password);
          const { data: newUser, error: insertErr } = await supabase
            .from("users")
            .insert({
              email:                creds!.email,
              hashed_password:      hashed,
              tradingview_username: creds!.tradingViewUsername,
              plan:                 creds!.plan,
              billing:              creds!.billing,
            })
            .single();
          if (insertErr || !newUser) return null;
          user = newUser;
        } else {
          // 3) verify existing password
          const { compare } = await import("bcryptjs").then(b => ({ compare: b.compare }));
          const valid       = await compare(creds!.password, (user as any).hashed_password);
          if (!valid) return null;
        }

        // 4) stash our extra fields on the returned user for callbacks/events
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
      // After login/registration, send to dashboard
      return `${baseUrl}/dashboard`;
    },
  },

  events: {
    // When NextAuth creates a new user, also upsert your “profiles” table
    async createUser({ user }) {
      await supabase.from("profiles").upsert({
        id:                   user.id,
        tradingview_username: (user as any).tradingViewUsername || null,
        plan:                 (user as any).plan,
        billing:              (user as any).billing,
      });
    },
  },

  session: { strategy: "jwt" },

  // ← Make NextAuth use your unified /auth page for all sign‐in & sign‐up flows
  pages: { signIn: "/auth" },

  // ⚠️ Keep this secret safe & synced in Vercel env vars
  secret: process.env.NEXTAUTH_SECRET,
};
