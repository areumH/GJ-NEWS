import { useState, useEffect, useRef } from 'react';
import { FILTER_OPTION } from '@/constants/messages';
import { SortIcon } from '@/components/Icon/SortIcon';
import { SortType } from '@/types/search';

interface SortDropdownProps {
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
}

const SortDropdown = ({ currentSort, onSortChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = () => {
    const newSort = currentSort === 'sim' ? 'date' : 'sim';
    onSortChange(newSort);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={handleToggle}
        className="inline-flex items-center gap-1 h-9 pl-3 pr-2 rounded-full border border-gray-200 bg-white text-sm sm:text-base text-gray-700 whitespace-nowrap hover:border-gray-300 cursor-pointer"
      >
        {currentSort === 'sim' ? FILTER_OPTION.SIM : FILTER_OPTION.DATE}
        <SortIcon className="w-4 h-4 text-gray-400" isOpen={isOpen} />
      </button>
      {/* 레이아웃을 밀어내지 않도록 버튼 아래에 띄워서 연다 */}
      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 min-w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={handleSelect}
            className="w-full px-3 py-2 text-left text-sm sm:text-base text-gray-700 whitespace-nowrap hover:bg-gray-50 cursor-pointer"
          >
            {currentSort === 'sim' ? FILTER_OPTION.DATE : FILTER_OPTION.SIM}
          </button>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
