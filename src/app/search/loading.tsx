import { SpinnerIcon } from '@/components/Icon/SpinnerIcon';
import SearchBar from '@/components/SearchBar';
import { FilterState } from '@/components/FilterOption';
import FilterOption from '@/components/FilterOption';

export default function Search() {
  const filter: FilterState = {
    showPositiveOnly: false,
    showTitleOnly: false,
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center px-7 sm:px-12 py-6 gap-5 sm:gap-6 bg-gray-50">
      <SearchBar keyword={''} />
      <FilterOption sort="sim" filter={filter} />
      <div className="flex w-full justify-center items-center mt-50 sm:mt-40">
        <SpinnerIcon className="w-10 h-10 text-indigo-800 animate-spin" style={{ animationDuration: '1.5s' }} />
      </div>
    </div>
  );
}
