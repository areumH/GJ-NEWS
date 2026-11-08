import { Suspense } from 'react';
import SearchHeader, { SearchHeaderView } from '@/components/SearchHeader';

const FALLBACK_FILTER = { showPositiveOnly: false, showTitleOnly: false };

// 헤더를 레이아웃에 두면 loading.tsx·error.tsx로 바뀌는 동안에도 헤더가 그대로 유지된다
export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full min-h-screen items-center gap-4 sm:gap-5">
      {/* useSearchParams는 cacheComponents 환경에서 Suspense 경계가 필요하다. fallback은 같은 모양으로 둬 레이아웃 이동을 없앤다 */}
      <Suspense fallback={<SearchHeaderView query="" sort="sim" filter={FALLBACK_FILTER} />}>
        <SearchHeader />
      </Suspense>
      {children}
    </div>
  );
}
