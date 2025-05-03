import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Replace with your actual DB/user check logic
  if (email === 'test@example.com' && password === 'password123') {
    return NextResponse.json({
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
    });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
