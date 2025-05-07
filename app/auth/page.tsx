// app/auth/page.tsx
'use client';
export const dynamic = 'force-dynamic';

import React, { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type PlanKey = "the_one_stock" | "the_one_elite" | "the_one_premium";

const PLAN_CONFIG: Record<
  PlanKey,
  { label: string; monthly: number; yearly: number }
> = {
  the_one_stock: {
    label: "The One: Stock Swing Analyzer",
    monthly: 49.99,
    yearly: 499.9,
  },
  the_one_elite: {
    label: "The One Elite – Dynamic Liquidity",
    monthly: 59.99,
    yearly: 599.9,
  },
  the_one_premium: {
    label: "The One Premium (both indicators)",
    monthly: 99.99,
    yearly: 999.9,
  },
};

export default function AuthPage() {
  const params = useSearchParams();
  const router = useRouter();
  const hint = params.get("screen_hint");
  const [view, setView] = useState<"signup" | "login" | "forgot">(
    hint === "login" ? "login" : hint === "forgot" ? "forgot" : "signup"
  );

  // shared
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // signup fields
  const rawPlan = (params.get("plan") as PlanKey) ?? "the_one_stock";
  const rawBilling = (params.get("billing") as "monthly" | "yearly") ?? "monthly";
  const [tvUser, setTvUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<PlanKey>(rawPlan);
  const [billing, setBilling] = useState<"monthly" | "yearly">(rawBilling);

  // login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // forgot
  const [forgotEmail, setForgotEmail] = useState("");

  const price =
    billing === "monthly" ? PLAN_CONFIG[plan].monthly : PLAN_CONFIG[plan].yearly;

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      tradingViewUsername: tvUser,
      email,
      password,
      plan,
      billing,
    });
    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    try {
      const r = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing, email }),
      });
      const { url } = await r.json();
      if (!url) throw new Error("Checkout failed");
      router.push(url);
    } catch (err: any) {
      setError(err.message || "Checkout error");
      setLoading(false);
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: loginEmail,
      password: loginPassword,
      callbackUrl: "/dashboard",
    });
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const resp = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail }),
    });
    setError(resp.ok ? "Check your email for instructions" : "Failed to send link");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex bg-black text-white">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          {/* Tabs */}
          <div className="flex space-x-2">
            {(["signup", "login", "forgot"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setView(mode);
                  setError("");
                }}
                className={`flex-1 py-2 rounded ${
                  view === mode ? "bg-teal-500 text-black" : "bg-gray-800"
                }`}
              >
                {mode === "signup"
                  ? "Sign Up"
                  : mode === "login"
                  ? "Log In"
                  : "Forgot?"}
              </button>
            ))}
          </div>

          {error && <p className="text-red-400">{error}</p>}

          {/* Sign Up */}
          {view === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full py-3 bg-white text-black rounded-lg"
              >
                Continue with Google
              </button>
              <div className="flex items-center">
                <hr className="flex-1 border-gray-700" />
                <span className="px-2 text-gray-400">OR</span>
                <hr className="flex-1 border-gray-700" />
              </div>
              <input
                type="text"
                required
                placeholder="TradingView Username"
                value={tvUser}
                onChange={(e) => setTvUser(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 rounded"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 rounded"
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 rounded"
              />
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as PlanKey)}
                className="w-full px-4 py-2 bg-gray-900 rounded"
              >
                {Object.entries(PLAN_CONFIG).map(([k, c]) => (
                  <option key={k} value={k}>
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="flex space-x-4">
                {(["monthly", "yearly"] as const).map((c) => (
                  <label key={c} className="flex-1">
                    <input
                      type="radio"
                      name="billing"
                      value={c}
                      checked={billing === c}
                      onChange={() => setBilling(c)}
                      className="mr-2"
                    />
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </label>
                ))}
              </div>
              <p className="text-center text-lg font-bold">${price}/{billing}</p>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 rounded disabled:opacity-50"
              >
                {loading ? "Processing…" : "Start 30-Day Free Trial"}
              </button>
            </form>
          )}

          {/* Log In */}
          {view === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                required
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 rounded"
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 rounded"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 rounded disabled:opacity-50"
              >
                {loading ? "Processing…" : "Log In"}
              </button>
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full py-3 bg-white text-black rounded"
              >
                Continue with Google
              </button>
            </form>
          )}

          {/* Forgot */}
          {view === "forgot" && (
            <form onSubmit={handleForgot} className="space-y-4">
              <input
                type="email"
                required
                placeholder="Your Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 rounded"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 rounded disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
