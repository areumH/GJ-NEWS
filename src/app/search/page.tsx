'use client';

import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import NewsCard from '@/components/NewsCard';

export default function Search() {
  const searchParams = useSearchParams();
  // const query = searchParams.get('query') || '';
  const page = Number(searchParams.get('page')) || 1;

  return (
    <div className="flex flex-col w-full min-h-screen items-center px-7 sm:px-9 py-6 bg-gray-50">
      <SearchBar />
      <div className="flex flex-col w-full mt-7 sm:mt-9 gap-2 sm:gap-5">
        <NewsCard isTitleOnly={true} />
        <NewsCard isTitleOnly={false} />
      </div>
      페이지: {page}
    </div>
  );
}
