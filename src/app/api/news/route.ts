import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { API_ERROR, UPSTREAM_TIMEOUT_MS } from '@/constants/api';
import { newsSearchParamsSchema } from '@/schemas/search';
import { searchNewsWithSentiment } from '@/api/server/news';

export const GET = async (req: NextRequest) => {
  const result = newsSearchParamsSchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));

  if (!result.success) {
    // 400은 클라이언트 입력 문제이므로 어떤 필드가 왜 틀렸는지 알려준다
    return NextResponse.json(
      { error: API_ERROR.INVALID_PARAMS, fields: z.flattenError(result.error).fieldErrors },
      { status: 400 },
    );
  }

  try {
    // 감정 점수가 붙은 뉴스 (첫 페이지 서버 렌더링과 같은 함수)
    const data = await searchNewsWithSentiment(result.data);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      console.error(`[api/news] Naver API timed out after ${UPSTREAM_TIMEOUT_MS}ms`);
      return NextResponse.json({ error: API_ERROR.UPSTREAM_TIMEOUT }, { status: 504 });
    }
    // Naver 응답 오류, 네트워크 오류, JSON이 아닌 응답 등
    console.error('[api/news] Naver API request failed', error);
    return NextResponse.json({ error: API_ERROR.UPSTREAM_FAILED }, { status: 502 });
  }
};
