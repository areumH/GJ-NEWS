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
    className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-full border text-sm sm:text-base whitespace-nowrap transition cursor-pointer ${
      checked
        ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
    }`}
  >
    <CheckIcon
      className={`w-4 h-4 sm:w-5 sm:h-5 ${checked ? 'text-indigo-600' : 'text-gray-300'}`}
      isChecked={checked}
    />
    {label}
  </button>
);

const FilterCheckboxGroup = ({
  showTitleOnly,
  showPositiveOnly,
  onTitleOnlyChange,
  onPositiveOnlyChange,
}: FilterCheckboxGroupProps) => {
  return (
    <div className="flex gap-2">
      <FilterToggle label={FILTER_OPTION.TITLE} checked={showTitleOnly} onChange={onTitleOnlyChange} />
      <FilterToggle label={FILTER_OPTION.POSITIVE} checked={showPositiveOnly} onChange={onPositiveOnlyChange} />
    </div>
  );
};

export default FilterCheckboxGroup;
