'use client';

import { useState } from 'react';
import { FilterState } from '@/types/search';
import { SortIcon } from '@/components/Icon/icons/SortIcon';

export interface FilterOptionProps {
  filter: FilterState;
  onChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

const FilterOption = ({ filter, onChange }: FilterOptionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col mr-auto px-1 sm:px-2 text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-lg sm:text-2xl sm:py-1 font-semibold text-gray-800 cursor-pointer"
      >
        옵션
        <SortIcon className="w-6 h-6 sm:w-7 sm:h-7" isOpen={isOpen} />
      </button>
      {isOpen && (
        <div className="flex flex-col mt-2 text-lg sm:text-xl">
          <div className="flex gap-4 sm:gap-6 w-full py-1.5 sm:py-3 border-t-2 border-gray-100">
            <span>정렬</span>
            <button
              onClick={() => {
                onChange('sort', 'date');
              }}
              className={`${
                filter.sort === 'date' ? 'text-indigo-700 font-semibold' : 'text-gray-600'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => {
                onChange('sort', 'sim');
              }}
              className={`${
                filter.sort === 'sim' ? 'text-indigo-700 font-semibold' : 'text-gray-600'
              }`}
            >
              정확도순
            </button>
          </div>
          <div className="flex gap-4 sm:gap-6 w-full py-1.5 sm:py-3 border-t-2 border-gray-100">
            <span>필터</span>
            <button
              onClick={() => {
                onChange('showPositiveOnly', false);
              }}
              className={`${
                !filter.showPositiveOnly ? 'text-indigo-700 font-semibold' : 'text-gray-600'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => {
                onChange('showPositiveOnly', true);
              }}
              className={`${
                filter.showPositiveOnly ? 'text-indigo-700 font-semibold' : 'text-gray-600'
              }`}
            >
              긍정 뉴스만
            </button>
          </div>
          <div className="flex gap-4 sm:gap-6 w-full py-1.5 sm:py-3 border-t-2 border-gray-100">
            <span>표시</span>
            <button
              onClick={() => {
                onChange('showTitleOnly', false);
              }}
              className={`${
                !filter.showTitleOnly ? 'text-indigo-700 font-semibold' : 'text-gray-600'
              }`}
            >
              내용 포함
            </button>
            <button
              onClick={() => {
                onChange('showTitleOnly', true);
              }}
              className={`${
                filter.showTitleOnly ? 'text-indigo-700 font-semibold' : 'text-gray-600'
              }`}
            >
              제목만
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterOption;
