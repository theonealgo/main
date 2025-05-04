import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { username } = body;

  if (!username) {
    return NextResponse.json({ error: 'Missing username' }, { status: 400 });
  }

  // TODO: Save username to your DB or a file
  console.log('TradingView username submitted:', username);

  return NextResponse.json({ success: true });
}
