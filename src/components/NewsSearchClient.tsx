'use client';

import { PAGE_ELEMENT } from '@/constants/pagination';
import { useNewsListQuery } from '@/hooks/api/search';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { NewsResponse } from '@/types/news';
import { SpinnerIcon } from '@/components/Icon/SpinnerIcon';
import NoResultMessage from '@/components/NoResultMessage';
import NewsList from '@/components/NewsList';

interface NewsSearchClientProps {
  query: string;
  sort: 'sim' | 'date';
  initialData: NewsResponse | null;
}

// 검색 헤더(검색창·정렬·필터)는 src/app/search/layout.tsx에 있다
const NewsSearchClient = ({ query, sort, initialData }: NewsSearchClientProps) => {
  const { filter } = useSearchFilter();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNewsListQuery({
    query,
    display: PAGE_ELEMENT,
    sort,
    initialData: initialData ?? undefined,
  });

  const allNews = data?.pages.flatMap((page) => page.items) ?? [];
  const totalResults = data?.pages[0]?.total ?? 0;

  return (
    <div className="flex flex-col w-full px-7 sm:px-12">
      {isLoading ? (
        <div className="flex w-full justify-center items-center mt-50 sm:mt-40">
          <SpinnerIcon className="w-10 h-10 text-indigo-400 animate-spin" style={{ animationDuration: '1.5s' }} />
        </div>
      ) : totalResults === 0 ? (
        <div className="flex w-full justify-center items-center mt-50 sm:mt-40">
          <NoResultMessage keyword={query} />
        </div>
      ) : (
        <div className="flex flex-col w-full items-center gap-5 sm:gap-7">
          <NewsList
            news={allNews}
            filter={filter}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={fetchNextPage}
          />
        </div>
      )}
    </div>
  );
};

export default NewsSearchClient;
