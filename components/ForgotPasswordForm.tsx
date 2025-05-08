// components/ForgotPasswordForm.tsx
'use client';
import React, { useState, FormEvent } from 'react';

export default function ForgotPasswordForm() {
  const [email,setEmail] = useState('');
  const handleReset = (e:FormEvent) => {
    e.preventDefault();
    alert(`Password reset link sent to ${email}`);
  };
  return (
    <form onSubmit={handleReset} className="space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg">
      <input type="email" placeholder="Enter your email" required value={email}
             onChange={e=>setEmail(e.target.value)}
             className="w-full px-4 py-3 bg-gray-800 rounded" />
      <button type="submit" className="w-full bg-blue-600 py-3 rounded font-semibold">
        Send Reset Link
      </button>
    </form>
  );
}
