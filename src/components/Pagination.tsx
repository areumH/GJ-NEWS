/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useEffect, useState } from 'react';
import { slicePageByLimit } from '@/utils/pagination';
import { PAGE_GROUP, PAGE_ELEMENT } from '@/constants/pagination';
import { ChevronLeft } from './Icon/icons/ChevronLeft';
import { ChevronRight } from './Icon/icons/ChevronRight';
import { FirstChevronLeft } from './Icon/icons/FirstChevronLeft';
import { LastChevronRight } from './Icon/icons/LastChevronRight';

export interface PaginationProps {
  currentPage: number;
  total: number;
  setPage: (page: number) => void;
}

const Pagination = ({ currentPage, total, setPage }: PaginationProps) => {
  if (total <= PAGE_ELEMENT) return;

  const totalPage = Math.ceil(total / PAGE_ELEMENT);
  const [currentPageArray, setCurrentPageArray] = useState<number[]>([]);
  const [totalPageArray, setTotalPageArray] = useState<number[][]>([]);

  useEffect(() => {
    if (currentPage % PAGE_GROUP === 0) {
      setCurrentPageArray(totalPageArray[Math.floor(currentPage / PAGE_GROUP) - 1]);
    } else {
      setCurrentPageArray(totalPageArray[Math.floor(currentPage / PAGE_GROUP)]);
    }
  }, [currentPage, totalPageArray]);

  useEffect(() => {
    const slicedPages = slicePageByLimit(totalPage, PAGE_GROUP);
    setTotalPageArray(slicedPages);
    setCurrentPageArray(slicedPages[0]);
  }, [totalPage]);

  return (
    <div className="flex gap-6 sm:gap-12">
      <div className="flex gap-1 sm:gap-3">
        <button onClick={() => setPage(1)} disabled={currentPage === 1}>
          <FirstChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-indigo-600" />
        </button>
        <button onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-indigo-600" />
        </button>
      </div>
      <div className="flex gap-5 sm:gap-10">
        {currentPageArray.map((i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`${
              currentPage === i ? 'text-indigo-600 font-semibold' : 'text-gray-500'
            } text-base sm:text-xl hover:text-indigo-600`}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="flex gap-1">
        <button onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPage}>
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-indigo-600" />
        </button>
        <button onClick={() => setPage(totalPage)} disabled={currentPage === totalPage}>
          <LastChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-indigo-600" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
