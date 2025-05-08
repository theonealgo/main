import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

// Extend the default NextAuth session type
declare module "next-auth" {
interface Session extends DefaultSession {
accessToken?: string;
user: {
id: string; // Stronger typing for guaranteed use
plan?: string;
billing?: string;
tradingViewUsername?: string;
} & DefaultSession["user"];
}

interface User {
id: string;
plan?: string;
billing?: string;
tradingViewUsername?: string;
}
}

// Extend the JWT type to include the accessToken, user ID, and custom fields
declare module "next-auth/jwt" {
interface JWT extends DefaultJWT {
accessToken?: string;
id?: string;
plan?: string;
billing?: string;
tradingViewUsername?: string;
}
}
