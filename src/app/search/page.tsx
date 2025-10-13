'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { PAGE_ELEMENT } from '@/constants/pagination';
import { useNewsListQuery } from '@/hooks/api/search';
import { SpinnerIcon } from '@/components/Icon/SpinnerIcon';
import { FilterState } from '@/components/FilterOption';
import FilterOption from '@/components/FilterOption';
import SearchBar from '@/components/SearchBar';
import NoResultMessage from '@/components/NoResultMessage';
import NewsList from '@/components/NewsList';

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const [filter, setFilter] = useState<FilterState>({
    sort: 'sim',
    showPositiveOnly: false,
    showTitleOnly: false,
  });

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNewsListQuery({
    query,
    display: PAGE_ELEMENT,
    sort: filter.sort,
  });

  // 관찰자 요소
  const observerRef = useRef<HTMLDivElement>(null);

  // 스크롤 감시
  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    // 옵저버 생성
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allNews = data?.pages.flatMap((page) => page.items) ?? [];
  const totalResults = data?.pages[0]?.total ?? 0;

  return (
    <div className="flex flex-col w-full min-h-screen items-center px-7 sm:px-12 py-6 gap-5 sm:gap-6">
      <SearchBar keyword={query} />
      <FilterOption filter={filter} onChange={handleFilterChange} />

      {isLoading ? (
        <div className="flex w-full justify-center items-center mt-50 sm:mt-40">
          <SpinnerIcon className="w-10 h-10 text-indigo-400 animate-spin" style={{ animationDuration: '1.5s' }} />
        </div>
      ) : (
        <div className="w-full">
          {totalResults === 0 ? (
            <div className="flex w-full justify-center items-center mt-50 sm:mt-40">
              <NoResultMessage keyword={query} />
            </div>
          ) : (
            <div className="flex flex-col w-full items-center gap-5 sm:gap-7">
              <NewsList news={allNews} filter={filter} />
              
              {hasNextPage && (
                <div ref={observerRef} className="flex w-full justify-center items-center py-4">
                  {isFetchingNextPage && (
                    <SpinnerIcon
                      className="w-8 h-8 text-indigo-400 animate-spin"
                      style={{ animationDuration: '1.5s' }}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
