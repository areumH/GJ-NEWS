'use client';

import { useState, useEffect } from 'react';
import { FilterState } from '@/types/search';
import { FILTER_OPTION } from '@/constants/messages';
import { SortIcon } from '@/components/Icon/icons/SortIcon';
import { CheckIcon } from './Icon/icons/CheckIcon';

export interface FilterOptionProps {
  filter: FilterState;
  onChange?: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

const FilterOption = ({ filter, onChange }: FilterOptionProps) => {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleOptionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSortOpen(!isSortOpen);
  };

  const handleSelectedSort = () => {
    onChange?.('sort', filter.sort === 'sim' ? 'date' : 'sim');
    setIsSortOpen(false);
  };

  const handleOutsideClick = () => {
    setIsSortOpen(false);
  };

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex w-full justify-between items-start px-1 sm:px-2 sm:h-20">
      <div className="flex flex-col w-22 sm:w-28 bg-indigo-50 rounded-md">
        <button
          onClick={handleOptionClick}
          className="flex justify-between items-center px-1.5 sm:px-2 sm:py-1 text-indigo-950 sm:text-xl"
        >
          {filter.sort === 'sim' ? FILTER_OPTION.SIM : FILTER_OPTION.DATE}
          <SortIcon className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-950" isOpen={isSortOpen} />
        </button>
        {isSortOpen && (
          <button
            onClick={handleSelectedSort}
            className="flex items-center px-1.5 sm:px-2 sm:py-1 text-indigo-950 border-t-1 border-t-white sm:text-xl"
          >
            {filter.sort === 'sim' ? FILTER_OPTION.DATE : FILTER_OPTION.SIM}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1 sm:gap-3">
        <div className="flex justify-between items-center gap-2 sm:gap-4 text-base sm:text-xl">
          {FILTER_OPTION.TITLE}
          <button
            className="cursor-pointer"
            onClick={() => {
              onChange?.('showTitleOnly', !filter.showTitleOnly);
            }}
          >
            <CheckIcon
              className={`w-6 h-6 sm:w-7 sm:h-7 ${
                filter.showTitleOnly ? 'text-indigo-700' : 'text-gray-400'
              }`}
              isChecked={filter.showTitleOnly}
            />
          </button>
        </div>
        <div className="flex justify-between items-center gap-2 sm:gap-4 text-base sm:text-xl">
          {FILTER_OPTION.POSITIVE}
          <button
            className="cursor-pointer"
            onClick={() => {
              onChange?.('showPositiveOnly', !filter.showPositiveOnly);
            }}
          >
            <CheckIcon
              className={`w-6 h-6 sm:w-7 sm:h-7 ${
                filter.showPositiveOnly ? 'text-indigo-700' : 'text-gray-400'
              }`}
              isChecked={filter.showPositiveOnly}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterOption;
