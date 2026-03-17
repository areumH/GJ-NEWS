'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PATH } from '@/constants/path';
import { PLACE_HOLDER } from '@/constants/messages';
import { SearchIcon } from '@/components/Icon/SearchIcon';
import { useRecentSearches } from '@/hooks/useRecentSearches';

export interface SearchBarProps {
  keyword?: string;
}

const SearchBar = ({ keyword }: SearchBarProps) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { items, addItem, removeItem } = useRecentSearches();

  const [keywordValue, setKeywordValue] = useState(keyword || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (value = keywordValue) => {
    if (!value.trim()) return;

    addItem(value);
    setIsOpen(false);
    router.push(PATH.SEARCH(value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative w-full">
      <div ref={containerRef}>
        <div className="flex w-full h-12 sm:h-16 items-center rounded-2xl px-2 sm:px-4 border-2 border-indigo-300">
          <button
            onClick={() => handleSearch()}
            className="flex shrink-0 justify-center items-center w-8 h-8 sm:w-12 sm:h-12 cursor-pointer"
          >
            <SearchIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
          </button>
          <input
            value={keywordValue}
            placeholder={PLACE_HOLDER.SEARCH}
            onChange={(e) => setKeywordValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            className="w-full h-full px-2 sm:px-3 placeholder-gray-500 text-md sm:text-xl outline-none text-black"
          />
        </div>

        {isOpen && items.length > 0 && (
          <ul
            role="listbox"
            className="absolute z-10 mt-1 w-full rounded-2xl border border-gray-200 bg-white overflow-hidden"
          >
            {items.map((item) => (
              <li
                key={item}
                role="option"
                className="flex justify-between items-center px-4 py-3 cursor-pointer text-gray-700 hover:bg-indigo-50"
              >
                <span onClick={() => handleSearch(item)} className="flex-1">
                  {item}
                </span>
                <button
                  onClick={() => removeItem(item)}
                  className="text-gray-400 hover:text-gray-600 text-sm px-1 cursor-pointer"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
