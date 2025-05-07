// app/signup/SignupPageContent.tsx
'use client';

import { useSearchParams } from "next/navigation";
import SignupForm from "@/components/SignupForm";   // <- absolute path

export default function SignupPageContent() {
  const params      = useSearchParams();
  const rawPlan     = params.get("plan")    ?? "";
  const rawBilling  = params.get("billing") ?? "";
  const validPlans   = ["the_one_stock","the_one_elite","the_one_premium"];
  const validBilling = ["monthly","yearly"];

  const plan    = validPlans.includes(rawPlan)    ? rawPlan    : "the_one_stock";
  const billing = validBilling.includes(rawBilling) ? rawBilling : "monthly";

  return (
    <section
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/images/bground.jpg')" }}
    >
      <div className="p-8 bg-white/20 backdrop-blur-sm rounded-lg shadow-lg max-w-2xl w-full">
        <SignupForm plan={plan} billing={billing} />
      </div>
    </section>
  );
}
