'use client';

import { useRouter } from 'next/navigation';
import { PATH } from '@/constants/path';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center gap-5 sm:gap-7">
        <p className="text-2xl">해당 페이지를 찾을 수 없습니다.</p>
        <button className="flex bg-indigo-100 hover:bg-indigo-200 rounded-2xl px-4 py-2 cursor-pointer" onClick={() => router.push(PATH.HOME)}>
          홈으로 돌아가기
        </button>
    </div>
  );
}
