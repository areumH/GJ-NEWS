import { Size } from '@/types/theme';
import { PLACE_HOLDER } from '@/constants/messages';
import { SearchIcon } from '@/components/Icon/icons/SearchIcon';
import iconSizes from '@/components/Icon/iconSizes';

export interface SearchBarProps {
  size?: Size;
}

const SearchBar = ({ size = 'md' }: SearchBarProps) => {
  return (
    <div className="flex max-w-5xl w-10/12 h-16 items-center  rounded-l-full rounded-r-full px-4  bg-white shadow-lg border-2 border-gray-100">
      <div className="flex shrink-0 justify-center items-center w-12 h-12 rounded-full bg-indigo-200 cursor-pointer">
        <SearchIcon className={`${iconSizes[size]}`} />
      </div>
      <input
        placeholder={PLACE_HOLDER.SEARCH}
        className="w-full h-full px-5 placeholder-gray-500 text-xl outline-none text-black"
      />
    </div>
  );
};

export default SearchBar;
