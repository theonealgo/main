// app/success/SuccessContent.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');

  return (
    <div>
      <h1>Success!</h1>
      <p>You subscribed to the {plan} plan.</p>
    </div>
  );
}
