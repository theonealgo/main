import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, priceId } = req.body;

  if (!email || !priceId) {
    return res.status(400).json({ error: 'Missing email or priceId.' });
  }

  try {
    // 🔎 STEP 1: Check if a Stripe customer already exists with this email
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    const existingCustomer = customers.data.length > 0 ? customers.data[0] : null;

    if (existingCustomer) {
      // 🔎 STEP 2: Check if they already have an active or trialing subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: existingCustomer.id,
        status: 'all',
        limit: 10,
      });

      const hasActiveOrTrial = subscriptions.data.some(sub =>
        ['trialing', 'active'].includes(sub.status)
      );

      if (hasActiveOrTrial) {
        return res.status(403).json({
          error: 'You’ve already used a free trial with this email. Please login or use a different plan.',
        });
      }
    }

    // 🧾 STEP 3: Create customer if not found
    const customer = existingCustomer || await stripe.customers.create({ email });

    // ✅ STEP 4: Create checkout session with 30-day trial
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 30,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/signup?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe session error:', err);
    res.status(400).json({ error: err.message });
  }
}