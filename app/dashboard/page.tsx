export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <p className="p-8 text-center">Please <a href="/signin" className="text-blue-600">sign in</a>.</p>;
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl">Welcome, {session.user.email}!</h1>
      <p>Plan: {session.user.plan} / {session.user.billing}</p>
      <p>TV Username: {session.user.tradingViewUsername}</p>
    </div>
  );
}
