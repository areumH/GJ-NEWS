export interface NoResultMessageProps {
  keyword: string;
}

const NoResultMessage = ({ keyword }: NoResultMessageProps) => {
  return (
    <div className="flex flex-col w-full items-center gap-0.5 sm:text-xl">
      <div className="text-center break-words">
        <span className="text-indigo-800">&apos;{keyword}&apos;</span>에 대한 검색 결과가 없습니다.
      </div>
      <div className="text-center break-words">검색어를 다시 확인해주세요!</div>
    </div>
  );
};

export default NoResultMessage;
