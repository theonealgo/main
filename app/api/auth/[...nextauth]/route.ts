// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Supabase client & adapter
import { createClient } from "@supabase/supabase-js";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;   // Use service role key for full CRUD
const supabase = createClient(supabaseUrl, supabaseKey);

export const authOptions = {
  adapter: SupabaseAdapter(supabase),

  providers: [
    // —————————— Email/Password + TV Username ——————————
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
      },
      async authorize(creds) {
        // 👇 Replace with your own verification logic against Supabase ‘users’ table
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", creds!.email)
          .single();

        if (error || !user) return null;
        // verify password here (bcrypt.compare, etc)…
        user.tradingViewUsername = creds!.tradingViewUsername!;
        return user;
      },
    }),

    // —————————— Google OAuth ——————————
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Persist TV username from token → session
    async jwt({ token, user }) {
      if (user?.tradingViewUsername) {
        token.tradingViewUsername = user.tradingViewUsername;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.tradingViewUsername = token.tradingViewUsername as string;
      return session;
    },
    // Redirect all logins to your dashboard
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },

  // Optional event: when a new user is created, insert into your ‘profiles’ table
  events: {
    async createUser({ user }) {
      await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          tradingview_username: (user as any).tradingViewUsername || null,
        });
    },
  },

  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
