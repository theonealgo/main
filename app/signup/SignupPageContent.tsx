'use client';

import SignupForm from './SignupForm';

export default function SignupContent() {
  return (
    <section
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/images/bground.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Create Your Free Account
        </h1>
        <SignupForm />
      </div>
    </section>
  );
}
