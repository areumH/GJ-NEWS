'use client';

import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';

export default function Search() {
  const searchParams = useSearchParams();
  // const query = searchParams.get('query') || '';
  const page = Number(searchParams.get('page')) || 1;

  return (
    <div className="flex flex-col w-full min-h-screen items-center py-6 bg-gray-50">
      <SearchBar />
      페이지: {page}
    </div>
  );
}
