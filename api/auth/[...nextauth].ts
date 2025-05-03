import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,  // Using the environment variable for Google client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,  // Using the environment variable for Google client secret
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,  // The secret used for JWT encryption
  pages: {
    signIn: '/signin',  // Optional: Customize sign-in page
    error: '/auth/error',  // Error page
  },
  session: {
    strategy: "jwt",  // Using JWT session strategy for stateless sessions
  },
  callbacks: {
    // JWT callback is invoked when NextAuth is creating the token
    async jwt({ token, account, user, profile }) {
      // Log the data to inspect what Google sends back (for debugging purposes)
      console.log("JWT callback:", { token, account, user, profile });

      // If account information is available, we store the access token and user ID
      if (account) {
        token.accessToken = account.access_token;  // Store the access token in JWT token
        token.id = profile?.sub || user?.id || null;  // Store the user ID in the token (fallback to user.id if profile.sub is missing)
      }

      return token;  // Return the updated token
    },

    // Session callback is invoked when NextAuth is creating the session object
    async session({ session, token }) {
      // Log the session and token data for debugging purposes
      console.log("Session callback:", { session, token });

      // Attach the access token to the session object
      session.accessToken = token.accessToken || null;
      // Attach the user ID to the session object
      session.user.id = token.id || null;

      return session;  // Return the session object
    },
  },
});

export { handler as GET, handler as POST };  // Export the handler for GET and POST requests
