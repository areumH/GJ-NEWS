import { SEARCH_RESULT } from '@/constants/messages';
import { SearchIcon } from '@/components/Icon/SearchIcon';

export interface NoResultMessageProps {
  keyword: string;
}

const NoResultMessage = ({ keyword }: NoResultMessageProps) => {
  return (
    <div className="flex flex-col w-full items-center gap-3 text-center">
      <div className="flex w-12 h-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <SearchIcon className="w-6 h-6" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-base sm:text-lg font-medium text-gray-900 break-words">
          <span className="text-indigo-600">&apos;{keyword}&apos;</span>
          {SEARCH_RESULT.NONE}
        </p>
        <p className="text-sm sm:text-base text-gray-500">{SEARCH_RESULT.CHECK_KEYWORD}</p>
      </div>
    </div>
  );
};

export default NoResultMessage;
