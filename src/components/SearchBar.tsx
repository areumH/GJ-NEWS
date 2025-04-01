'use client';

import { useState } from 'react';
import { Size } from '@/types/theme';
import { PATH } from '@/constants/path';
import { PLACE_HOLDER } from '@/constants/messages';
import { SearchIcon } from '@/components/Icon/icons/SearchIcon';
import iconSizes from '@/components/Icon/iconSizes';
import { useRouter, useSearchParams } from 'next/navigation';

export interface SearchBarProps {
  size?: Size;
}

const SearchBar = ({ size = 'lg' }: SearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('query') || '');

  const handleSearch = () => {
    router.push(PATH.SEARCH(keyword, 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex max-w-5xl w-10/12 h-16 items-center  rounded-l-full rounded-r-full px-4  bg-white shadow-lg border-2 border-gray-100">
      <button
        onClick={handleSearch}
        className="flex shrink-0 justify-center items-center w-12 h-12 rounded-full bg-indigo-200 cursor-pointer"
      >
        <SearchIcon className={`${iconSizes[size]}`} />
      </button>
      <input
        value={keyword}
        placeholder={PLACE_HOLDER.SEARCH}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-full px-5 placeholder-gray-500 text-xl outline-none text-black"
      />
    </div>
  );
};

export default SearchBar;
