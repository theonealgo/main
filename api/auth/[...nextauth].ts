import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || (() => { throw new Error("Missing GOOGLE_CLIENT_ID") })(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || (() => { throw new Error("Missing GOOGLE_CLIENT_SECRET") })(),
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || (() => { throw new Error("Missing NEXTAUTH_SECRET") })(),

  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account, user, profile }) {
      console.log("🔥 JWT callback fired", { token, account, user, profile });

      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.sub || user?.id || null;
      }

      return token;
    },

    async session({ session, token }) {
      console.log("💥 Session callback fired", { session, token });

      session.accessToken = token.accessToken ?? null;
      session.user.id = token.id ?? null;

      return session;
    },
  },
});

export { handler as GET, handler as POST };
