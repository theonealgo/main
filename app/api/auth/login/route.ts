// app/api/auth/login/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { email, password, tradingViewUsername } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // Save or upsert the tradingViewUsername, if needed
  await supabase
    .from('profiles')
    .upsert({ id: data.user.id, tradingViewUsername });

  return NextResponse.json({ user: data.user });
}
