import { FilterState } from '@/types/search';
import { SpinnerIcon } from '@/components/Icon/icons/SpinnerIcon';
import SearchBar from '@/components/SearchBar';
import FilterOption from '@/components/FilterOption';

export default function Search() {
  const filter: FilterState = {
    sort: 'sim',
    showPositiveOnly: false,
    showTitleOnly: false,
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center px-7 sm:px-12 py-6 gap-5 sm:gap-6 bg-gray-50">
      <SearchBar keyword={''} />
      <FilterOption filter={filter} />
      <div className="flex w-full justify-center items-center mt-50 sm:mt-40">
        <SpinnerIcon
          className="w-10 h-10 text-indigo-800 animate-spin"
          style={{ animationDuration: '1.5s' }}
        />
      </div>
    </div>
  );
}
