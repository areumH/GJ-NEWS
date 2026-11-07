import { useSearchParams } from 'next/navigation';
import { FILTER_SEARCH_PARAMS } from '@/constants/path';
import { FilterState } from '@/types/search';

// 검색 결과 필터를 URL 쿼리에서 읽고 쓴다.
// 헤더(필터 컨트롤)와 결과 목록이 같은 URL을 읽으므로 별도 상태 공유가 필요 없다.
export const useSearchFilter = () => {
  const searchParams = useSearchParams();

  const filter: FilterState = {
    showTitleOnly: searchParams.get(FILTER_SEARCH_PARAMS.showTitleOnly) === '1',
    showPositiveOnly: searchParams.get(FILTER_SEARCH_PARAMS.showPositiveOnly) === '1',
  };

  const setFilterValue = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(FILTER_SEARCH_PARAMS[key], '1');
    } else {
      params.delete(FILTER_SEARCH_PARAMS[key]);
    }
    // replaceState는 서버 요청 없이 URL만 바꾸고 useSearchParams를 갱신한다 (필터 토글이 즉시 반영됨)
    // 토글마다 기록이 쌓이지 않도록 pushState가 아닌 replaceState를 쓴다
    window.history.replaceState(null, '', `?${params}`);
  };

  return { filter, setFilterValue };
};
