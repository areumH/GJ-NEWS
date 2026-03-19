import { FILTER_OPTION } from '@/constants/messages';
import { CheckIcon } from './Icon/CheckIcon';

interface FilterCheckboxGroupProps {
  showTitleOnly: boolean;
  showPositiveOnly: boolean;
  onTitleOnlyChange: (value: boolean) => void;
  onPositiveOnlyChange: (value: boolean) => void;
}

const FilterCheckboxGroup = ({
  showTitleOnly,
  showPositiveOnly,
  onTitleOnlyChange,
  onPositiveOnlyChange,
}: FilterCheckboxGroupProps) => {
  return (
    <div className="flex flex-col gap-1 sm:gap-3">
      <div className="flex justify-between items-center gap-2 sm:gap-4 text-base sm:text-xl">
        {FILTER_OPTION.TITLE}
        <button className="cursor-pointer" onClick={() => onTitleOnlyChange(!showTitleOnly)}>
          <CheckIcon
            className={`w-6 h-6 sm:w-7 sm:h-7 ${showTitleOnly ? 'text-indigo-600' : 'text-gray-400'}`}
            isChecked={showTitleOnly}
          />
        </button>
      </div>
      <div className="flex justify-between items-center gap-2 sm:gap-4 text-base sm:text-xl">
        {FILTER_OPTION.POSITIVE}
        <button className="cursor-pointer" onClick={() => onPositiveOnlyChange(!showPositiveOnly)}>
          <CheckIcon
            className={`w-6 h-6 sm:w-7 sm:h-7 ${showPositiveOnly ? 'text-indigo-600' : 'text-gray-400'}`}
            isChecked={showPositiveOnly}
          />
        </button>
      </div>
    </div>
  );
};

export default FilterCheckboxGroup;
