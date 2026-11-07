import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ENV } from '@/config/env';
import { API_ERROR, UPSTREAM_TIMEOUT_MS } from '@/constants/api';
import { newsSearchParamsSchema } from '@/schemas/search';

export const GET = async (req: NextRequest) => {
  const result = newsSearchParamsSchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));

  if (!result.success) {
    // 400은 클라이언트 입력 문제이므로 어떤 필드가 왜 틀렸는지 알려준다
    return NextResponse.json(
      { error: API_ERROR.INVALID_PARAMS, fields: z.flattenError(result.error).fieldErrors },
      { status: 400 },
    );
  }

  const { query, display, start, sort } = result.data;

  try {
    const params = new URLSearchParams({ query, display: String(display), start: String(start), sort });
    const res = await fetch(`https://openapi.naver.com/v1/search/news.json?${params}`, {
      headers: {
        'X-Naver-Client-Id': ENV.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': ENV.NAVER_CLIENT_SECRET,
      },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error(`[api/news] Naver API responded with ${res.status}`);
      return NextResponse.json({ error: API_ERROR.UPSTREAM_FAILED }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      console.error(`[api/news] Naver API timed out after ${UPSTREAM_TIMEOUT_MS}ms`);
      return NextResponse.json({ error: API_ERROR.UPSTREAM_TIMEOUT }, { status: 504 });
    }
    // 네트워크 오류, JSON이 아닌 응답 등
    console.error('[api/news] Naver API request failed', error);
    return NextResponse.json({ error: API_ERROR.UPSTREAM_FAILED }, { status: 502 });
  }
};
