'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PATH } from '@/constants/path';
import { ARIA_LABEL, PLACE_HOLDER } from '@/constants/messages';
import { SearchIcon } from '@/components/Icon/SearchIcon';
import { useRecentSearches } from '@/hooks/useRecentSearches';

export interface SearchBarProps {
  keyword?: string;
}

const SearchBar = ({ keyword }: SearchBarProps) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { items, addItem, removeItem } = useRecentSearches();

  const [keywordValue, setKeywordValue] = useState(keyword || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (value = keywordValue) => {
    if (!value.trim()) return;

    addItem(value);
    setIsOpen(false);
    router.push(PATH.SEARCH(value));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Esc: 목록을 닫고 포커스를 입력창으로 돌린다 (목록 항목에 포커스가 있었다면 사라지는 요소에 포커스가 남지 않도록)
  // focus()가 onFocus(목록 열기)를 먼저 실행하므로, 닫기는 그 뒤에 호출해야 최종 상태가 '닫힘'이 된다
  const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && isOpen) {
      inputRef.current?.focus();
      setIsOpen(false);
    }
  };

  // 포커스가 검색창·목록 바깥으로 나가면 닫는다 (Tab으로 빠져나갈 때, 바깥을 클릭할 때)
  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  // 삭제한 항목의 버튼이 사라지면 포커스가 페이지 맨 위로 튀므로 입력창으로 옮긴다
  const handleRemove = (item: string) => {
    removeItem(item);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div onKeyDown={handleContainerKeyDown} onBlur={handleContainerBlur}>
        {/* role="search": 스크린 리더의 랜드마크 목록에 "검색" 영역으로 표시된다 (form이 아니어도 지정 가능) */}
        <div
          role="search"
          className="flex w-full h-12 sm:h-16 items-center rounded-2xl px-2 sm:px-4 border-2 border-indigo-300"
        >
          <button
            type="button"
            aria-label={ARIA_LABEL.SEARCH_BUTTON}
            onClick={() => handleSearch()}
            className="flex shrink-0 justify-center items-center w-8 h-8 sm:w-12 sm:h-12 cursor-pointer"
          >
            <SearchIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
          </button>
          <input
            ref={inputRef}
            aria-label={ARIA_LABEL.SEARCH_INPUT}
            value={keywordValue}
            placeholder={PLACE_HOLDER.SEARCH}
            onChange={(e) => setKeywordValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onFocus={() => setIsOpen(true)}
            // 이미 포커스가 있는 상태에서 목록을 닫았다면 onFocus가 다시 오지 않으므로 클릭으로도 연다
            onClick={() => setIsOpen(true)}
            className="w-full h-full px-2 sm:px-3 placeholder-gray-500 text-md sm:text-xl outline-none text-black"
          />
        </div>

        {isOpen && items.length > 0 && (
          // 마우스로 항목을 누를 때 입력창의 포커스가 빠지지 않게 한다
          // (Safari 등은 버튼 클릭 시 버튼에 포커스를 주지 않아, blur로 목록이 먼저 닫히면 클릭이 사라진다)
          <ul
            aria-label={ARIA_LABEL.RECENT_SEARCHES}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute z-10 mt-1 w-full rounded-2xl border border-gray-200 bg-white overflow-hidden"
          >
            {items.map((item) => (
              <li key={item} className="flex items-center text-gray-700 hover:bg-indigo-50">
                <button
                  type="button"
                  onClick={() => handleSearch(item)}
                  className="flex-1 px-4 py-3 text-left cursor-pointer"
                >
                  {item}
                </button>
                <button
                  type="button"
                  aria-label={ARIA_LABEL.REMOVE_RECENT_SEARCH(item)}
                  onClick={() => handleRemove(item)}
                  className="px-4 py-3 text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
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
