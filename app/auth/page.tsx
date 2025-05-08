import React, { Suspense } from 'react';
import AuthClientPage from './AuthClientPage';

export const dynamic = 'force-dynamic';

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          Loading…
        </div>
      }
    >
      <AuthClientPage />
    </Suspense>
  );
}
