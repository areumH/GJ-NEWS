'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PATH } from '@/constants/path';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { FilterState } from '@/types/search';
import SearchBar from '@/components/SearchBar';
import FilterOption from '@/components/FilterOption';

interface SearchHeaderViewProps {
  query: string;
  sort: 'sim' | 'date';
  filter: FilterState;
  onSortChange?: (sort: 'sim' | 'date') => void;
  onFilterChange?: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

// 헤더 마크업만 담당. Suspense fallback은 URL을 읽을 수 없으므로 값을 props로 받는다
export const SearchHeaderView = ({ query, sort, filter, onSortChange, onFilterChange }: SearchHeaderViewProps) => {
  return (
    <div className="sticky top-0 z-50 w-full bg-white pt-6 pb-2">
      <div className="px-7 sm:px-12 flex flex-col w-full gap-5">
        {/* 검색어가 바뀌면(최근 검색어 클릭, 뒤로 가기) 입력값을 URL과 맞추기 위해 다시 마운트 */}
        <SearchBar key={query} keyword={query} />
        <FilterOption sort={sort} filter={filter} onSortChange={onSortChange} onChange={onFilterChange} />
      </div>
    </div>
  );
};

// 레이아웃은 searchParams를 받지 못하므로 URL에서 직접 읽는다
const SearchHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filter, setFilterValue } = useSearchFilter();

  const query = searchParams.get('query') ?? '';
  const sort = searchParams.get('sort') === 'date' ? 'date' : 'sim';

  // 정렬을 바꿔도 필터는 유지한다
  const handleSortChange = (newSort: 'sim' | 'date') => {
    router.push(PATH.SEARCH(query, newSort, filter));
  };

  return (
    <SearchHeaderView
      query={query}
      sort={sort}
      filter={filter}
      onSortChange={handleSortChange}
      onFilterChange={setFilterValue}
    />
  );
};

export default SearchHeader;
