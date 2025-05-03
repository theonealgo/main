'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomLogin = async () => {
    const res = await signIn('credentials', {
      redirect: true,
      email,
      password,
      callbackUrl: '/',
    });

    if (res?.error) {
      alert('Invalid login');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleCustomLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          Sign In with Email
        </button>
        <hr className="border-t border-gray-700 my-4" />
        <button
          onClick={() => signIn('google')}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
