import { useState, useEffect, useRef } from 'react';
import { FILTER_OPTION } from '@/constants/messages';
import { SortIcon } from '@/components/Icon/SortIcon';

interface SortDropdownProps {
  currentSort: 'sim' | 'date';
  onSortChange: (sort: 'sim' | 'date') => void;
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
    <div ref={dropdownRef} className="flex flex-col w-22 sm:w-28 bg-indigo-50 rounded-md">
      <button
        onClick={handleToggle}
        className="flex justify-between items-center px-1.5 sm:px-2 sm:py-1 text-indigo-950 sm:text-xl cursor-pointer"
      >
        {currentSort === 'sim' ? FILTER_OPTION.SIM : FILTER_OPTION.DATE}
        <SortIcon className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-950" isOpen={isOpen} />
      </button>
      {isOpen && (
        <button
          onClick={handleSelect}
          className="flex items-center px-1.5 sm:px-2 sm:py-1 text-indigo-950 border-t-1 border-t-white sm:text-xl"
        >
          {currentSort === 'sim' ? FILTER_OPTION.DATE : FILTER_OPTION.SIM}
        </button>
      )}
    </div>
  );
};

export default SortDropdown;
