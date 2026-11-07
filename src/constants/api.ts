import { NEWS_MAX_ITEMS } from '@/constants/news';

// Naver 뉴스 검색 API 파라미터 허용 범위 (검증 스키마: src/schemas/search.ts)
export const NEWS_SEARCH_PARAMS = {
  DISPLAY_MIN: 1,
  DISPLAY_MAX: 100,
  START_MIN: 1,
  START_MAX: NEWS_MAX_ITEMS,
  SORTS: ['sim', 'date'],
  DEFAULT_SORT: 'sim',
} as const;

// 외부 API(Naver, Google) 요청 제한 시간. 넘으면 요청을 중단하고 504를 반환한다
export const UPSTREAM_TIMEOUT_MS = 5000;

// Route Handler 에러 응답 문구 ({ error: string } 형식으로 반환)
// 외부 API의 원본 에러 본문은 클라이언트에 넘기지 않는다
export const API_ERROR = {
  INVALID_PARAMS: 'Invalid request parameters',
  INVALID_BODY: 'Invalid request body',
  UPSTREAM_FAILED: 'Upstream API request failed',
  UPSTREAM_TIMEOUT: 'Upstream API request timed out',
} as const;
