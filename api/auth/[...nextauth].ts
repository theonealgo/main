// pages/api/auth/[...nextauth].ts
import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: AuthOptions = {
  adapter: SupabaseAdapter(supabase),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tradingview_username: { label: 'TradingView Username', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password || !credentials.tradingview_username) {
          throw new Error('All fields are required');
        }

        // Check if user exists
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (error) throw new Error(error.message);
        
        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error('Invalid credentials');

        // Verify TradingView username matches
        if (user.tradingview_username !== credentials.tradingview_username) {
          throw new Error('Invalid TradingView username');
        }

        return user;
      }
    })
  ],
  callbacks: {
    async session({ session, user, token }) {
      // Add TradingView username to session
      if (token.tradingview_username) {
        session.user.tradingview_username = token.tradingview_username;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Fetch complete user data from Supabase
        const { data: supabaseUser } = await supabase
          .from('users')
          .select('tradingview_username')
          .eq('id', user.id)
          .single();

        token.tradingview_username = supabaseUser?.tradingview_username;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Check/update TradingView username for Google users
        const { data: existingUser } = await supabase
          .from('users')
          .select('tradingview_username')
          .eq('email', user.email)
          .single();

        if (!existingUser?.tradingview_username) {
          // Redirect to username setup page
          return '/auth/username-setup';
        }
      }
      return true;
    }
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/username-setup', // New users will be directed here
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
