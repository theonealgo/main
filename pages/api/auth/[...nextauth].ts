import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,  // Make sure the NEXTAUTH_SECRET is set correctly
  pages: {
    signIn: '/signin',  // Optional: Customize sign-in page
    error: '/auth/error',  // Optional: Error page
  },
  session: {
    strategy: "jwt",  // Use JWT tokens for session
  },
  callbacks: {
    async jwt({ token, account, user, profile }) {
      if (account) {
        token.accessToken = account.access_token;  // Store the access token in the JWT
        token.id = profile?.sub || user?.id || null;  // Store user ID in the JWT
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken || null;  // Attach access token to session
      session.user.id = token.id || null;  // Attach user ID to session
      return session;
    },
  },
});
