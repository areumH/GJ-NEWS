import { NextRequest, NextResponse } from 'next/server';
import { ENV } from '@/config/env';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const key = ENV.GOOGLE_API_KEY;

  const res = await fetch(`https://language.googleapis.com/v2/documents:analyzeSentiment?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
};
