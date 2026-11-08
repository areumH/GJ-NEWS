'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PATH } from '@/constants/path';
import { ARIA_LABEL, MESSAGE, PLACE_HOLDER } from '@/constants/messages';
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
    <div className="relative w-full min-w-0">
      <div onKeyDown={handleContainerKeyDown} onBlur={handleContainerBlur}>
        {/* role="search": 스크린 리더의 랜드마크 목록에 "검색" 영역으로 표시된다 (form이 아니어도 지정 가능) */}
        <div
          role="search"
          className="flex w-full h-12 sm:h-14 items-center rounded-xl bg-white px-2 sm:px-3 border border-gray-200 shadow-sm transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100"
        >
          <button
            type="button"
            aria-label={ARIA_LABEL.SEARCH_BUTTON}
            onClick={() => handleSearch()}
            className="flex shrink-0 justify-center items-center w-9 h-9 rounded-lg text-gray-400 hover:text-indigo-600 cursor-pointer"
          >
            <SearchIcon className="w-5 h-5 sm:w-6 sm:h-6" />
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
            className="w-full min-w-0 h-full px-1.5 sm:px-2 bg-transparent placeholder-gray-400 text-base sm:text-lg outline-none text-gray-900"
          />
        </div>

        {isOpen && items.length > 0 && (
          // 마우스로 항목을 누를 때 입력창의 포커스가 빠지지 않게 한다
          // (Safari 등은 버튼 클릭 시 버튼에 포커스를 주지 않아, blur로 목록이 먼저 닫히면 클릭이 사라진다)
          <div
            onMouseDown={(e) => e.preventDefault()}
            className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
          >
            {/* 화면용 제목. 스크린 리더는 목록의 aria-label로 읽으므로 숨긴다 */}
            <p aria-hidden className="px-4 pt-3 pb-1 text-xs font-medium text-gray-400">
              {MESSAGE.RECENT_SEARCHES}
            </p>
            <ul aria-label={ARIA_LABEL.RECENT_SEARCHES} className="pb-1">
              {items.map((item) => (
                <li key={item} className="flex items-center text-gray-700 hover:bg-gray-50">
                  <button
                    type="button"
                    onClick={() => handleSearch(item)}
                    className="flex-1 min-w-0 truncate px-4 py-2.5 text-left cursor-pointer"
                  >
                    {item}
                  </button>
                  <button
                    type="button"
                    aria-label={ARIA_LABEL.REMOVE_RECENT_SEARCH(item)}
                    onClick={() => handleRemove(item)}
                    className="px-4 py-2.5 text-gray-300 hover:text-gray-600 text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
