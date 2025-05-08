// app/auth/page.tsx
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up / Log In',
};

// dynamic import with no SSR (so Next.js won’t try to prerender it)
const AuthClient = dynamic(() => import('./AuthClientPage'), { ssr: false });

export default function AuthPage() {
  return <AuthClient />;
}
