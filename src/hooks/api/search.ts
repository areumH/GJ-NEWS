import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { NewsSearchParams } from '@/types/search';
import { NewsResponse } from '@/types/news';
import { getNextPageStart } from '@/utils/pagination';
import { getNewsResult } from '@/api/client/news';

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
    // lastPage: 최근에 불러온 마지막 페이지 응답, allPages: 지금까지 불러온 페이지 배열
    // 다음 pageParam(start). undefined면 더 불러올 페이지가 없다
    getNextPageParam: (lastPage, allPages) => getNextPageStart(allPages.length, display, lastPage.total),
    initialPageParam: 1,
    // 서버에서 받은 첫 페이지. initialDataUpdatedAt을 지정하지 않으면 지금 시점의 데이터로 보고 staleTime 동안 다시 요청하지 않는다
    initialData: initialData ? { pages: [initialData], pageParams: [1] } : undefined,
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
