'use client';

import { useState } from 'react';
import { PATH } from '@/constants/path';
import { PLACE_HOLDER } from '@/constants/messages';
import { SearchIcon } from '@/components/Icon/icons/SearchIcon';
import { useRouter } from 'next/navigation';

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
    <div className="flex w-full h-12 sm:h-16 items-center  rounded-l-full rounded-r-full px-2 sm:px-4 bg-white shadow-md sm:shadow-lg border-2 border-gray-100">
      <button
        onClick={handleSearch}
        className="flex shrink-0 justify-center items-center w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-indigo-200 cursor-pointer"
      >
        <SearchIcon className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
      <input
        value={keywordValue}
        placeholder={PLACE_HOLDER.SEARCH}
        onChange={(e) => setKeywordValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-full px-3 sm:px-5 placeholder-gray-500 text-md sm:text-xl outline-none text-black"
      />
    </div>
  );
};

export default SearchBar;
