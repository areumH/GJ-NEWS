import { BRAND } from '@/constants/messages';
import SearchBar from '@/components/SearchBar';

export default function Main() {
  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center gap-6 sm:gap-8 px-4 sm:px-6">
      {/* 클릭되지 않는 로고. 홈 화면의 제목이므로 h1으로 둔다 */}
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 select-none">
        <span className="text-indigo-600">{BRAND.ACCENT}</span>
        {BRAND.REST}
      </h1>
      <SearchBar />
    </div>
  );
}
