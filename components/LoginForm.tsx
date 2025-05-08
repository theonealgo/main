// components/LoginForm.tsx
'use client';
import React, { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const handleLogin = (e:FormEvent) => {
    e.preventDefault();
    signIn('credentials', { email, password, callbackUrl:'/dashboard'});
  };
  return (
    <form onSubmit={handleLogin} className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg">
      <input type="email" placeholder="Email" required value={email}
             onChange={e=>setEmail(e.target.value)}
             className="w-full px-4 py-3 bg-gray-800 rounded" />
      <input type="password" placeholder="Password" required value={password}
             onChange={e=>setPassword(e.target.value)}
             className="w-full px-4 py-3 bg-gray-800 rounded" />
      <button type="submit" className="w-full bg-blue-600 py-3 rounded font-semibold">
        Log In
      </button>
    </form>
  );
}
