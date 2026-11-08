'use client';

import { PAGE_ELEMENT } from '@/constants/pagination';
import { useNewsListQuery } from '@/hooks/api/search';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { NewsResponse } from '@/types/news';
import { PendingSentiments } from '@/types/sentiment';
import { SortType } from '@/types/search';
import { SpinnerIcon } from '@/components/Icon/SpinnerIcon';
import NoResultMessage from '@/components/NoResultMessage';
import NewsList from '@/components/NewsList';

interface NewsSearchClientProps {
  query: string;
  sort: SortType;
  initialData: NewsResponse | null;
  // 첫 페이지 감정 점수 (서버에서 기다리지 않고 넘긴 Promise, 기사 link가 키)
  initialSentiments: PendingSentiments | null;
}

// 검색 헤더(검색창·정렬·필터)는 src/app/search/layout.tsx에 있다
const NewsSearchClient = ({ query, sort, initialData, initialSentiments }: NewsSearchClientProps) => {
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
    <div className="flex flex-col w-full px-4 sm:px-6 pb-10">
      {isLoading ? (
        <div className="flex w-full justify-center items-center mt-50 sm:mt-40">
          <SpinnerIcon className="w-10 h-10 text-indigo-500 animate-spin" style={{ animationDuration: '1.5s' }} />
        </div>
      ) : totalResults === 0 ? (
        <div className="flex w-full justify-center items-center mt-50 sm:mt-40">
          <NoResultMessage keyword={query} />
        </div>
      ) : (
        <div className="flex flex-col w-full items-center">
          <NewsList
            news={allNews}
            pendingSentiments={initialSentiments}
            filter={filter}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            // 요청 직후 isFetchingNextPage가 반영되기 전에 다시 호출되더라도
            // 진행 중인 요청을 취소하고 다시 보내지 않도록 cancelRefetch: false (기본값 true)
            onLoadMore={() => fetchNextPage({ cancelRefetch: false })}
          />
        </div>
      )}
    </div>
  );
};

export default NewsSearchClient;
