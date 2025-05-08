// app/auth/page.tsx
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

export const metadata = {
  title: 'Sign Up / Log In – The One Algo',
}

// Dynamically load the client component, disabling SSR and enabling Suspense
const AuthClient = dynamic(() => import('./AuthClient'), {
  ssr: false,
  suspense: true,
})

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading…
        </div>
      }
    >
      <AuthClient />
    </Suspense>
  )
}
