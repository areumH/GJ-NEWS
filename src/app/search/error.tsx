'use client';

import Link from 'next/link';
import { PATH } from '@/constants/path';
import { SEARCH_ERROR } from '@/constants/messages';

export default function SearchError({ retry }: { retry: () => void }) {
  return (
    // 헤더는 layout.tsx에 있으므로 결과 영역 위치(NoResultMessage와 같은 여백)에 그린다
    <div className="flex flex-col w-full px-7 sm:px-12 items-center mt-50 sm:mt-40 gap-5 sm:gap-7">
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl">{SEARCH_ERROR.TITLE}</p>
        <p className="text-gray-500">{SEARCH_ERROR.DESCRIPTION}</p>
      </div>
      <div className="flex gap-3">
        {/* retry: 서버 컴포넌트 데이터를 다시 불러와 렌더링 (reset은 다시 불러오지 않음) */}
        <button
          type="button"
          onClick={() => retry()}
          className="flex bg-indigo-100 hover:bg-indigo-200 rounded-2xl px-4 py-2 cursor-pointer"
        >
          {SEARCH_ERROR.RETRY}
        </button>
        <Link href={PATH.HOME} className="flex bg-gray-100 hover:bg-gray-200 rounded-2xl px-4 py-2">
          {SEARCH_ERROR.HOME}
        </Link>
      </div>
    </div>
  );
}
