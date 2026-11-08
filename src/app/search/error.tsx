'use client';

import Link from 'next/link';
import { PATH } from '@/constants/path';
import { SEARCH_ERROR } from '@/constants/messages';

export default function SearchError({ retry }: { retry: () => void }) {
  return (
    // 헤더는 layout.tsx에 있으므로 결과 영역 위치(NoResultMessage와 같은 여백)에 그린다
    <div className="flex flex-col w-full px-4 sm:px-6 items-center mt-50 sm:mt-40 gap-6 text-center">
      <div className="flex flex-col items-center gap-1">
        <p className="text-base sm:text-lg font-semibold text-gray-900">{SEARCH_ERROR.TITLE}</p>
        <p className="text-sm sm:text-base text-gray-500">{SEARCH_ERROR.DESCRIPTION}</p>
      </div>
      <div className="flex gap-3">
        {/* retry: 서버 컴포넌트 데이터를 다시 불러와 렌더링 (reset은 다시 불러오지 않음) */}
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex items-center h-10 px-5 rounded-lg bg-indigo-600 text-sm sm:text-base font-medium text-white hover:bg-indigo-700 cursor-pointer"
        >
          {SEARCH_ERROR.RETRY}
        </button>
        <Link
          href={PATH.HOME}
          className="inline-flex items-center h-10 px-5 rounded-lg border border-gray-200 bg-white text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50"
        >
          {SEARCH_ERROR.HOME}
        </Link>
      </div>
    </div>
  );
}
