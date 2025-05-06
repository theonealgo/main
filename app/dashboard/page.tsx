// app/dashboard/page.tsx
export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="p-8 text-center">
        <p>You must <a href="/signin" className="text-blue-600">sign in</a> first.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl">Welcome, {session.user.email}!</h1>
      <p>Your plan: { (session.user as any).plan } / { (session.user as any).billing }</p>
      <p>TV Username: { (session.user as any).tradingViewUsername }</p>
      {/* …your dashboard UI here… */}
    </div>
  );
}
