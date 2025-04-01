'use client';

import { useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const page = Number(searchParams.get('page')) || 1;

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-gray-50">
      검색어: {query} 페이지: {page}
    </div>
  );
}
