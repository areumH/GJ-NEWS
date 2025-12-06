'use client';

import { useCallback } from 'react';
import SortDropdown from './SortDropdown';
import FilterCheckboxGroup from './FilterCheckboxGroup';

export interface FilterState {
  sort: 'sim' | 'date';
  showPositiveOnly: boolean;
  showTitleOnly: boolean;
}

export interface FilterOptionProps {
  filter: FilterState;
  onChange?: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

const FilterOption = ({ filter, onChange }: FilterOptionProps) => {
  const handleSortChange = useCallback((sort: 'sim' | 'date') => {
    onChange?.('sort', sort);
  }, [onChange]);

  const handleTitleOnlyChange = useCallback((value: boolean) => {
    onChange?.('showTitleOnly', value);
  }, [onChange]);

  const handlePositiveOnlyChange = useCallback((value: boolean) => {
    onChange?.('showPositiveOnly', value);
  }, [onChange]);

  return (
    <div className="flex w-full justify-between items-start px-1 sm:px-2 sm:h-20">
      {/* 정렬 */}
      <SortDropdown currentSort={filter.sort} onSortChange={handleSortChange} />

      {/* 필터 체크 */}
      <FilterCheckboxGroup
        showTitleOnly={filter.showTitleOnly}
        showPositiveOnly={filter.showPositiveOnly}
        onTitleOnlyChange={handleTitleOnlyChange}
        onPositiveOnlyChange={handlePositiveOnlyChange}
      />
    </div>
  );
};

export default FilterOption;
