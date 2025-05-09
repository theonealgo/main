import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { email, password, tradingViewUsername } = await req.json()
  // Attempt sign‐in with password
  const { data, error } = await supabase.auth.admin.signInWithPassword({
    email,
    password,
  })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
  // Optionally: record the TV username on login if you need it
  await supabase
    .from('profiles')
    .upsert({ id: data.user.id, tradingViewUsername })
  return NextResponse.json({ user: data.user })
}
