import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Replace these with your real DB calls:
async function verifyUser(email: string, password: string) {
  // e.g. query your Supabase or whatever
  // return { id, name, email } or null
}

export const authOptions = {
  providers: [
    // 1️⃣ Classic email/password
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
        const user = await verifyUser(creds!.email, creds!.password);
        if (user) {
          // Attach the TradingView username for later
          user.tradingViewUsername = creds!.tradingViewUsername;
          return user;
        }
        return null;
      },
    }),

    // 2️⃣ Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Persist tradingViewUsername into the JWT after sign-in
    async jwt({ token, user }) {
      if (user?.tradingViewUsername) {
        token.tradingViewUsername = user.tradingViewUsername;
      }
      return token;
    },
    // Expose it on session.user
    async session({ session, token }) {
      session.user.tradingViewUsername = token.tradingViewUsername as string;
      return session;
    },
    // Send everyone to /dashboard after login
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },

  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",   // your custom sign-in page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
