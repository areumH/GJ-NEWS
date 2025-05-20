import { SEARCH_RESULT } from '@/constants/messages';

export interface NoResultMessageProps {
  keyword: string;
}

const NoResultMessage = ({ keyword }: NoResultMessageProps) => {
  return (
    <div className="flex flex-col w-full items-center gap-0.5 sm:text-xl">
      <div className="text-center break-words">
        <span className="text-indigo-800">&apos;{keyword}&apos;</span>
        {SEARCH_RESULT.NONE}
      </div>
      <div className="text-center break-words">{SEARCH_RESULT.CHECK_KEYWORD}</div>
    </div>
  );
};

export default NoResultMessage;
