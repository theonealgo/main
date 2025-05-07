// app/api/stripe/create-checkout/route.ts
import { getServerSession } from "next-auth/next";
import Stripe from "stripe";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { plan, billing } = session.user as any;
  const priceId = billing === "yearly"
    ? process.env[`STRIPE_PRICE_${plan.toUpperCase()}_YEARLY`]
    : process.env[`STRIPE_PRICE_${plan.toUpperCase()}_MONTHLY`];

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId!, quantity: 1 }],
    customer_email: session.user.email,
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/signup?plan=${plan}&billing=${billing}`,
  });

  return new Response(null, {
    status: 302,
    headers: { Location: checkout.url! },
  });
}
