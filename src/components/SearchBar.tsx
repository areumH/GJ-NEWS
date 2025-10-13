'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PATH } from '@/constants/path';
import { PLACE_HOLDER } from '@/constants/messages';
import { SearchIcon } from '@/components/Icon/SearchIcon';

export interface SearchBarProps {
  keyword?: string;
}

const SearchBar = ({ keyword }: SearchBarProps) => {
  const router = useRouter();
  const [keywordValue, setKeywordValue] = useState(keyword || '');

  const handleSearch = () => {
    router.push(PATH.SEARCH(keywordValue, 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full h-12 sm:h-16 items-center rounded-2xl px-2 sm:px-4 border-2 border-indigo-300">
      <button
        onClick={handleSearch}
        className="flex shrink-0 justify-center items-center w-8 h-8 sm:w-12 sm:h-12 cursor-pointer"
      >
        <SearchIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
      </button>
      <input
        value={keywordValue}
        placeholder={PLACE_HOLDER.SEARCH}
        onChange={(e) => setKeywordValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-full px-2 sm:px-3 placeholder-gray-500 text-md sm:text-xl outline-none text-black"
      />
    </div>
  );
};

export default SearchBar;
