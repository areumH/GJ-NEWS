import { useQuery } from '@tanstack/react-query';
import { NewsResponse } from '@/types/news';
import { NewsSearchParams } from '@/types/search';
import { getNewsResult } from '@/api/search';

export const useNewsListQuery = (params: NewsSearchParams) => {
  const { data: newsList, isLoading } = useQuery<NewsResponse>({
    queryKey: ['news', params.query, params.start, params.sort],
    queryFn: () => getNewsResult(params.query, params.display, params.start, params.sort),
  });

  return { newsList, isLoading };
};
