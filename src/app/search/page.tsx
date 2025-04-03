'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterState } from '@/types/search';
import SearchBar from '@/components/SearchBar';
import NewsCard from '@/components/NewsCard';
import FilterOption from '@/components/FilterOption';

export default function Search() {
  const searchParams = useSearchParams();
  // const query = searchParams.get('query') || '';
  const page = Number(searchParams.get('page')) || 1;

  const [filter, setFilter] = useState<FilterState>({
    sort: 'sim',
    showPositiveOnly: false,
    showTitleOnly: false,
  });

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center px-7 sm:px-9 py-6 gap-4 sm:gap-6 bg-gray-50">
      <SearchBar />
      <FilterOption filter={filter} onChange={handleFilterChange} />
      <div className="flex flex-col w-full gap-2 sm:gap-5">
        <NewsCard isTitleOnly={filter.showTitleOnly} />
        <NewsCard isTitleOnly={filter.showTitleOnly} />
      </div>
      페이지: {page}
    </div>
  );
}
