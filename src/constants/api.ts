import { NEWS_MAX_ITEMS } from '@/constants/news';
import { PAGE_ELEMENT } from '@/constants/pagination';

// Naver 뉴스 검색 API 파라미터 허용 범위 (검증 스키마: src/schemas/search.ts)
export const NEWS_SEARCH_PARAMS = {
  DISPLAY_MIN: 1,
  // 한 요청이 감정 분석을 기사 수만큼 호출하므로 앱이 쓰는 페이지 크기(20)로 제한한다 (Naver 자체 상한은 100)
  DISPLAY_MAX: PAGE_ELEMENT,
  START_MIN: 1,
  START_MAX: NEWS_MAX_ITEMS,
  SORTS: ['sim', 'date'],
  DEFAULT_SORT: 'sim',
} as const;

// 외부 API(Naver, Google) 요청 제한 시간. 넘으면 요청을 중단하고 504를 반환한다
export const UPSTREAM_TIMEOUT_MS = 5000;

// 감정 분석 요청을 Google에 동시에 몇 개까지 보낼지
// Google 분석은 1건당 약 1.2초라 5개씩 보내면 한 페이지(20건)에 약 5초, 20개를 한 번에 보내면 약 1.4초 걸린다(실측)
// 한 페이지를 한 번에 보내되, 상한을 둬서 DISPLAY_MAX가 커져도 요청이 한꺼번에 몰리지 않게 한다
export const SENTIMENT_CONCURRENCY = PAGE_ELEMENT;

// Route Handler 에러 응답 문구 ({ error: string } 형식으로 반환)
// 외부 API의 원본 에러 본문은 클라이언트에 넘기지 않는다
export const API_ERROR = {
  INVALID_PARAMS: 'Invalid request parameters',
  UPSTREAM_FAILED: 'Upstream API request failed',
  UPSTREAM_TIMEOUT: 'Upstream API request timed out',
} as const;
