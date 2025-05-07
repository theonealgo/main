// app/signup/page.tsx
export const dynamic = "force-dynamic";
import { Suspense } from "react";
import SignupPageContent from "./SignupPageContent";

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <SignupPageContent />
    </Suspense>
  );
}
