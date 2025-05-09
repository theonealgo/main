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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/signup`,
          {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(credentials),
          }
        );
        const user = await res.json();
        return res.ok && user ? user : null;
      },
    }),

    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth",       // all sign-in attempts (Credentials & OAuth) land here
    error:  "/auth?error", // errors here
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
