import { NextRequest, NextResponse } from 'next/server';
import { ENV } from '@/config/env';

export const GET = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  
  const query = searchParams.get('query');
  const display = searchParams.get('display');
  const start = searchParams.get('start');
  const sort = searchParams.get('sort');

  if (!query || !display || !start || !sort) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const res = await fetch(
    `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=${display}&start=${start}&sort=${sort}`,
    {
      headers: {
        'X-Naver-Client-Id': ENV.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': ENV.NAVER_CLIENT_SECRET,
      },
    },
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
};
