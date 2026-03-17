import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { NewsSearchParams } from '@/types/search';
import { NewsResponse } from '@/types/news';
import { getNewsResult } from '@/api/search';

export const useNewsListQuery = ({
  query,
  display,
  sort,
  initialData,
}: NewsSearchParams & { initialData?: NewsResponse }) => {
  const {
    data, // 모든 데이터 배열
    isLoading, // 첫 로딩
    fetchNextPage, // 다음 페이지를 불러오는 함수
    hasNextPage, // 다은 페이지 유무 여부
    isFetchingNextPage, // 다음 페이지를 불러오는 중
  } = useInfiniteQuery<NewsResponse, Error, InfiniteData<NewsResponse>, string[], number>({
    queryKey: ['news', query, sort],
    queryFn: ({ pageParam = 1 }) => getNewsResult(query, display, pageParam, sort),
    getNextPageParam: (lastPage, allPages) => {
      // lastPage: 최근에 불러온 마지막 페이지 응답 , allPages: 지금까지 불러온 페이지 배열
      const nextStart = allPages.length * display + 1;
      // 네이버 API는 최대 1000개까지만 제공
      if (nextStart > 1000 || nextStart > lastPage.total) {
        return undefined;
      }
      return nextStart; // 다음 pageParam 값
    },
    initialPageParam: 1,
    initialData: initialData ? { pages: [initialData], pageParams: [1] } : undefined,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
    staleTime: 30_000,
    enabled: !!query,
  });

  return {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
