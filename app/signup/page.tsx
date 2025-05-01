// Server Component: No hooks here!
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import SignupPageClient from './SignupPageClient';

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading signup form...</div>}>
      <SignupPageClient />
    </Suspense>
  );
}
