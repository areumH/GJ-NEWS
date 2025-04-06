'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterState } from '@/types/search';
import { PATH } from '@/constants/path';
import SearchBar from '@/components/SearchBar';
import NewsCard from '@/components/NewsCard';
import FilterOption from '@/components/FilterOption';
import { NewsItem } from '@/types/news';
import Pagination from '@/components/Pagination';

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

  const mockNewsItems: NewsItem[] = Array.from({ length: 3 }, (_, i) => ({
    title: `기사 제목 ${i + 1}`,
    originallink: '기사 원본 링크',
    link: '기사 링크',
    description: '기사 내용',
    pubDate: '2025.03.02',
  }));

  return (
    <div className="flex flex-col w-full min-h-screen items-center px-7 sm:px-12 py-6 gap-4 sm:gap-6 bg-gray-50">
      <SearchBar keyword={query} />
      <FilterOption filter={filter} onChange={handleFilterChange} />
      <div className="flex flex-col w-full gap-2 sm:gap-5">
        {mockNewsItems.map((news) => (
          <NewsCard key={news.title} news={news} isTitleOnly={filter.showTitleOnly} />
        ))}
      </div>
      페이지: {currentPage}
      <Pagination currentPage={currentPage} total={100} setPage={onChangePage} />
    </div>
  );
}
