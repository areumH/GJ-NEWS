import Link from 'next/link';
import { PATH } from '@/constants/path';
import { NOT_FOUND } from '@/constants/messages';

export default function NotFound() {
  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center gap-6 px-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <p className="text-5xl font-extrabold text-indigo-600">404</p>
        <p className="text-lg sm:text-xl font-semibold text-gray-900">{NOT_FOUND.TITLE}</p>
        <p className="text-sm sm:text-base text-gray-500">{NOT_FOUND.DESCRIPTION}</p>
      </div>
      <Link
        href={PATH.HOME}
        className="inline-flex items-center h-10 px-5 rounded-lg bg-indigo-600 text-sm sm:text-base font-medium text-white hover:bg-indigo-700"
      >
        {NOT_FOUND.HOME}
      </Link>
    </div>
  );
}
