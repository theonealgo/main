// app/auth/page.tsx
import React, { Suspense } from 'react';
import AuthClientPage from './AuthClientPage';

export const metadata = {
  title: 'Sign Up / Log In – The One Algo',
};

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading…
        </div>
      }
    >
      <AuthClientPage />
    </Suspense>
  );
}
