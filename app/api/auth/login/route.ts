// app/api/auth/login/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Initialize Supabase client for this route
  const supabase = createRouteHandlerClient({ cookies })

  // Pull in the credentials and TV username
  const { email, password, tradingViewUsername } = await req.json()

  // Perform a regular sign-in with email & password
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  // Optionally save TradingView username in your profiles table
  await supabase
    .from('profiles')
    .upsert({ id: data.user.id, tradingViewUsername })

  // Return the signed-in user
  return NextResponse.json({ user: data.user })
}
