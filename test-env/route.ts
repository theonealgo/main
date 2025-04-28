// app/api/test-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const publicUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return NextResponse.json({
    stripeKeyExists: !!stripeKey,
    publicUrl,
  });
}