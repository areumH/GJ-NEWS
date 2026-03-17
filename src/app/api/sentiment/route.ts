import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const key = process.env.GOOGLE_API_KEY;

  const res = await fetch(`https://language.googleapis.com/v2/documents:analyzeSentiment?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
};
