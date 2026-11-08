import { NEWS_MAX_ITEMS } from '@/constants/news';

// 다음 페이지의 시작 위치(Naver API의 start)를 계산한다. 더 불러올 페이지가 없으면 undefined
// - loadedPages: 지금까지 불러온 페이지 수, pageSize: 페이지당 기사 수, total: 전체 검색 결과 수
// - Naver API는 최대 1000번째(NEWS_MAX_ITEMS) 결과까지만 제공한다
export const getNextPageStart = (loadedPages: number, pageSize: number, total: number): number | undefined => {
  const nextStart = loadedPages * pageSize + 1;
  if (nextStart > NEWS_MAX_ITEMS || nextStart > total) return undefined;
  return nextStart;
};
