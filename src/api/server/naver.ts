// src/api/server/*: 서버에서 외부 API를 직접 호출하는 함수 (클라이언트에서 import하면 빌드 실패)
import 'server-only';
import { ENV } from '@/config/env';
import { UPSTREAM_TIMEOUT_MS } from '@/constants/api';
import { NaverNewsResponse } from '@/types/news';
import { NewsSearchQuery } from '@/schemas/search';

// Naver 뉴스 검색 (캐시 없음). /api/news가 쓴다
// 타임아웃이면 DOMException(TimeoutError)을 그대로 throw하므로 호출한 쪽에서 504/502를 구분할 수 있다
export const searchNaverNews = async ({ query, display, start, sort }: NewsSearchQuery): Promise<NaverNewsResponse> => {
  const params = new URLSearchParams({ query, display: String(display), start: String(start), sort });
  const res = await fetch(`https://openapi.naver.com/v1/search/news.json?${params}`, {
    headers: {
      'X-Naver-Client-Id': ENV.NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': ENV.NAVER_CLIENT_SECRET,
    },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Naver news API responded with ${res.status}`);
  }

  return res.json();
};

// 같은 검색을 캐싱하는 버전. 첫 페이지 서버 렌더링(search/page.tsx)이 쓴다
// - 에러 응답을 반환하면 캐싱되므로 throw한다 (throw된 결과는 캐싱되지 않음)
// - 'use cache' 함수에서 throw된 에러는 프로덕션에서 종류·메시지가 지워진 채 전달된다
//   → 에러 종류로 응답 코드를 나눠야 하는 /api/news는 캐시 없는 searchNaverNews를 쓴다 (페이지 쪽 에러는 error.tsx가 처리)
export const searchNaverNewsCached = async (params: NewsSearchQuery): Promise<NaverNewsResponse> => {
  'use cache';
  return searchNaverNews(params);
};
