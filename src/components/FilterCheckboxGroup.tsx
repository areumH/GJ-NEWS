import { FILTER_OPTION } from '@/constants/messages';
import { CheckIcon } from './Icon/CheckIcon';

interface FilterCheckboxGroupProps {
  showTitleOnly: boolean;
  showPositiveOnly: boolean;
  onTitleOnlyChange: (value: boolean) => void;
  onPositiveOnlyChange: (value: boolean) => void;
}

interface FilterToggleProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

// 글자와 아이콘을 하나의 토글 버튼으로 묶는다
// - 버튼 이름 = 글자(label), 켜짐/꺼짐 = aria-pressed → 스크린 리더가 "제목만, 토글 버튼, 눌림"처럼 읽는다
// - 글자를 눌러도 토글된다
const FilterToggle = ({ label, checked, onChange }: FilterToggleProps) => (
  <button
    type="button"
    aria-pressed={checked}
    onClick={() => onChange(!checked)}
    className="flex justify-between items-center gap-2 sm:gap-4 text-base sm:text-xl cursor-pointer"
  >
    {label}
    <CheckIcon className={`w-6 h-6 sm:w-7 sm:h-7 ${checked ? 'text-indigo-600' : 'text-gray-400'}`} isChecked={checked} />
  </button>
);

const FilterCheckboxGroup = ({
  showTitleOnly,
  showPositiveOnly,
  onTitleOnlyChange,
  onPositiveOnlyChange,
}: FilterCheckboxGroupProps) => {
  return (
    <div className="flex flex-col gap-1 sm:gap-3">
      <FilterToggle label={FILTER_OPTION.TITLE} checked={showTitleOnly} onChange={onTitleOnlyChange} />
      <FilterToggle label={FILTER_OPTION.POSITIVE} checked={showPositiveOnly} onChange={onPositiveOnlyChange} />
    </div>
  );
};

export default FilterCheckboxGroup;
