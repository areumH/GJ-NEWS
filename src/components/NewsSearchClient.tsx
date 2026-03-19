'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PAGE_ELEMENT, OBSERVER_THRESHOLD } from '@/constants/pagination';
import { PATH } from '@/constants/path';
import { useNewsListQuery } from '@/hooks/api/search';
import { NewsResponse } from '@/types/news';
import { FilterState } from '@/components/FilterOption';
import { SpinnerIcon } from '@/components/Icon/SpinnerIcon';
import SearchBar from '@/components/SearchBar';
import FilterOption from '@/components/FilterOption';
import NoResultMessage from '@/components/NoResultMessage';
import NewsList from '@/components/NewsList';

interface NewsSearchClientProps {
  query: string;
  sort: 'sim' | 'date';
  initialData: NewsResponse | null;
}

const NewsSearchClient = ({ query, sort, initialData }: NewsSearchClientProps) => {
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState<FilterState>({
    showPositiveOnly: false,
    showTitleOnly: false,
  });

  const handleSortChange = (newSort: 'sim' | 'date') => {
    router.push(PATH.SEARCH(query, newSort));
  };

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNewsListQuery({
    query,
    display: PAGE_ELEMENT,
    sort,
    initialData: initialData ?? undefined,
  });

  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: OBSERVER_THRESHOLD },
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allNews = data?.pages.flatMap((page) => page.items) ?? [];
  const totalResults = data?.pages[0]?.total ?? 0;

  return (
    <div className="flex flex-col w-full min-h-screen items-center gap-5 sm:gap-6">
      <div className="sticky top-0 z-50 w-full bg-white pt-6 pb-2">
        <div className="px-7 sm:px-12 flex flex-col w-full gap-5">
          <SearchBar keyword={query} />
          <FilterOption sort={sort} filter={filter} onSortChange={handleSortChange} onChange={handleFilterChange} />
        </div>
      </div>

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
            <NewsList news={allNews} filter={filter} />

            {hasNextPage && (
              <div ref={observerRef} className="flex w-full justify-center items-center py-4">
                {isFetchingNextPage && (
                  <SpinnerIcon className="w-8 h-8 text-indigo-400 animate-spin" style={{ animationDuration: '1.5s' }} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSearchClient;
