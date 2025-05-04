import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

interface ExtendedToken extends JWT {
  id?: string;
  accessToken?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace this with real DB/auth logic
        if (
          credentials?.email === "demo@example.com" &&
          credentials?.password === "demo"
        ) {
          return {
            id: "demo-user-id",
            name: "Demo User",
            email: "demo@example.com",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      const customToken = token as ExtendedToken;

      if (account) {
        customToken.accessToken = account.access_token;
        customToken.id = profile?.sub ?? user?.id ?? undefined;
      }

      return customToken;
    },

    async session({ session, token }) {
      const customToken = token as ExtendedToken;

      if (session.user && customToken.id) {
        session.user.id = customToken.id;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login", // Optional: custom login page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
