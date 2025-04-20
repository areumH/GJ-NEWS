'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterState } from '@/types/search';
import { PATH } from '@/constants/path';
import { PAGE_ELEMENT } from '@/constants/pagination';
import SearchBar from '@/components/SearchBar';
import NewsCard from '@/components/NewsCard';
import FilterOption from '@/components/FilterOption';
import Pagination from '@/components/Pagination';
import { useNewsListQuery } from '@/hooks/api/search';
import { SpinnerIcon } from '@/components/Icon/icons/SpinnerIcon';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get('query') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  const onChangePage = (page: number) => {
    router.push(PATH.SEARCH(query, page));
  };

  const [filter, setFilter] = useState<FilterState>({
    sort: 'sim',
    showPositiveOnly: false,
    showTitleOnly: false,
  });

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const { newsList, isLoading } = useNewsListQuery({
    query,
    display: PAGE_ELEMENT,
    start: PAGE_ELEMENT * (currentPage - 1) + 1,
    sort: filter.sort,
  });

  return (
    <div className="flex flex-col w-full min-h-screen items-center px-7 sm:px-12 py-6 gap-5 sm:gap-6 bg-gray-50">
      <SearchBar keyword={query} />
      <FilterOption filter={filter} onChange={handleFilterChange} />
      {isLoading ? (
        <div className="flex w-full justify-center items-center mt-52 sm:mt-44">
          <SpinnerIcon
            className="w-10 h-10 text-indigo-800 animate-spin"
            style={{ animationDuration: '1.5s' }}
          />
        </div>
      ) : (
        <div className="flex flex-col w-full items-center gap-5 sm:gap-7">
          <div className="flex flex-col w-full gap-2 sm:gap-5">
            {newsList?.items.map((news) => (
              <NewsCard
                key={news.title}
                news={news}
                isTitleOnly={filter.showTitleOnly}
                isPositiveOnly={filter.showPositiveOnly}
              />
            ))}
          </div>
          <div className="flex mt-5">
            <Pagination
              currentPage={currentPage}
              total={newsList?.total ?? 0}
              setPage={onChangePage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
