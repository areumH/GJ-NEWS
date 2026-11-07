import { FilterState } from '@/types/search';

// 필터 상태를 URL 쿼리에 저장할 때 쓰는 키 (값이 켜져 있으면 '1', 꺼져 있으면 키를 제거)
export const FILTER_SEARCH_PARAMS: Record<keyof FilterState, string> = {
  showTitleOnly: 'titleOnly',
  showPositiveOnly: 'positiveOnly',
};

export const PATH = {
  HOME: '/',

  SEARCH: (query: string, sort: 'sim' | 'date' = 'sim', filter?: Partial<FilterState>) => {
    const params = new URLSearchParams({ query, sort });
    for (const key of Object.keys(FILTER_SEARCH_PARAMS) as (keyof FilterState)[]) {
      if (filter?.[key]) params.set(FILTER_SEARCH_PARAMS[key], '1');
    }
    return `/search?${params}`;
  },
};
