import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(req: NextRequest) {
  const { plan, billing, email } = await req.json();

  if (!plan || !billing || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Match priceId from plan + billing combo
  const priceMap: Record<string, Record<string, string>> = {
    the_one_stock: {
      monthly: 'price_1RHjlnGM80oGs0bFw58mL9SQ',
      yearly: 'price_1RHjlnGM80oGs0bFaHuj0fVe',
    },
    the_one_elite: {
      monthly: 'price_1RHjljGM80oGs0bFnPEZ37Nm',
      yearly: 'price_1RHjljGM80oGs0bFzKJRH3ul',
    },
    the_one_premium: {
      monthly: 'price_1RHqfH4S3QlVoTDjEroNADmB',
      yearly: 'price_1RHqfH4S3QlVoTDjEroNADmB', // same for now
    },
  };

  const priceId = priceMap[plan]?.[billing];
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid plan or billing option' }, { status: 400 });
  }

  try {
    // Step 1: Check if customer already exists
    const existingCustomers = await stripe.customers.list({ email, limit: 1 });
    const customer = existingCustomers.data[0] || await stripe.customers.create({ email });

    // Step 2: Check if they already used a free trial
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 10,
    });

    const hasTrialOrActive = subscriptions.data.some(sub =>
      ['trialing', 'active'].includes(sub.status)
    );

    if (hasTrialOrActive) {
      return NextResponse.json(
        { error: 'You’ve already used a free trial with this email. Please login or choose a different plan.' },
        { status: 403 }
      );
    }

    // Step 3: Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 30 },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/signup?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe session error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
