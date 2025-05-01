import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {  // Use non-null assertion
 apiVersion: '2024-04-10' as any
});

export async function POST(req: NextRequest) {
  const { priceId } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return new NextResponse(
      JSON.stringify({ error: 'Payment session creation failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
