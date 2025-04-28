/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
// app/api/save-user/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { name, email, tradingViewUsername } = body;

  console.log("✅ New User:", name, email, tradingViewUsername);

  // In the next step, we can connect this to Google Sheets or Airtable

  return NextResponse.json({ success: true, message: "User info saved successfully." });
}