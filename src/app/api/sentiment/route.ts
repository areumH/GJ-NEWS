import { NextRequest, NextResponse } from 'next/server';
import { ENV } from '@/config/env';
import { API_ERROR, UPSTREAM_TIMEOUT_MS } from '@/constants/api';

export const POST = async (req: NextRequest) => {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: API_ERROR.INVALID_BODY }, { status: 400 });
  }

  try {
    const res = await fetch(`https://language.googleapis.com/v2/documents:analyzeSentiment?key=${ENV.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error(`[api/sentiment] Google NLP API responded with ${res.status}`);
      return NextResponse.json({ error: API_ERROR.UPSTREAM_FAILED }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      console.error(`[api/sentiment] Google NLP API timed out after ${UPSTREAM_TIMEOUT_MS}ms`);
      return NextResponse.json({ error: API_ERROR.UPSTREAM_TIMEOUT }, { status: 504 });
    }
    // 네트워크 오류, JSON이 아닌 응답 등. 요청 URL에 API 키가 있으므로 에러 객체는 로그에 남기지 않는다
    console.error('[api/sentiment] Google NLP API request failed');
    return NextResponse.json({ error: API_ERROR.UPSTREAM_FAILED }, { status: 502 });
  }
};
