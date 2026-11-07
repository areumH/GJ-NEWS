import type { NEWS_SEARCH_PARAMS } from '@/constants/api';

// 정렬: 'sim' 정확도순, 'date' 최신순 (허용값은 constants/api.ts의 NEWS_SEARCH_PARAMS.SORTS)
export type SortType = (typeof NEWS_SEARCH_PARAMS.SORTS)[number];

// 뉴스 목록 쿼리(useNewsListQuery) 파라미터. 시작 위치(start)는 무한 스크롤의 pageParam으로 계산한다
export interface NewsSearchParams {
  // 검색 키워드
  query: string;
  // 한 번에 불러올 뉴스 수
  display: number;
  sort: SortType;
}

// 검색 결과 필터. URL 쿼리(titleOnly, positiveOnly)로 관리한다
export interface FilterState {
  showPositiveOnly: boolean;
  showTitleOnly: boolean;
}
