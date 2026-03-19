'use client';

import SortDropdown from './SortDropdown';
import FilterCheckboxGroup from './FilterCheckboxGroup';

export interface FilterState {
  showPositiveOnly: boolean;
  showTitleOnly: boolean;
}

export interface FilterOptionProps {
  sort: 'sim' | 'date';
  filter: FilterState;
  onSortChange?: (sort: 'sim' | 'date') => void;
  onChange?: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

const FilterOption = ({ sort, filter, onSortChange, onChange }: FilterOptionProps) => {
  const handleTitleOnlyChange = (value: boolean) => {
    onChange?.('showTitleOnly', value);
  };

  const handlePositiveOnlyChange = (value: boolean) => {
    onChange?.('showPositiveOnly', value);
  };

  return (
    <div className="flex w-full justify-between items-start px-1 sm:px-2 sm:h-20">
      {/* 정렬 */}
      <SortDropdown currentSort={sort} onSortChange={(s) => onSortChange?.(s)} />

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
