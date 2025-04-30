// File: app/api/create-stripe-session/route.ts

import Stripe from 'stripe';
import { NextRequest } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-08-16', // Or latest stable version
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, priceId } = body;

    if (!email || !priceId) {
      return new Response(JSON.stringify({ error: 'Missing email or priceId.' }), { status: 400 });
    }

    const customers = await stripe.customers.list({ email, limit: 1 });
    const existingCustomer = customers.data[0] || null;

    if (existingCustomer) {
      const subscriptions = await stripe.subscriptions.list({
        customer: existingCustomer.id,
        status: 'all',
        limit: 10,
      });

      const hasActiveOrTrial = subscriptions.data.some(sub =>
        ['trialing', 'active'].includes(sub.status)
      );

      if (hasActiveOrTrial) {
        return new Response(JSON.stringify({
          error: 'You’ve already used a free trial with this email. Please login or use a different plan.',
        }), { status: 403 });
      }
    }

    const customer = existingCustomer || await stripe.customers.create({ email });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 30 },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/signup?canceled=true`,
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (err: any) {
    console.error('Stripe session error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
