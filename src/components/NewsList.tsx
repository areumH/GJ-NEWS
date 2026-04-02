import { Virtuoso } from 'react-virtuoso';
import { NewsItem } from '@/types/news';
import { FilterState } from '@/components/FilterOption';
import NewsCard from '@/components/NewsCard';
import { SpinnerIcon } from '@/components/Icon/SpinnerIcon';

interface NewsListProps {
  news: NewsItem[];
  filter: FilterState;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

const NewsList = ({ news, filter, hasNextPage, isFetchingNextPage, onLoadMore }: NewsListProps) => {
  return (
    <Virtuoso
      // 브라우저 window 스크롤 기준으로 가상화
      useWindowScroll
      // 렌더링할 데이터 배열
      data={news}
      // 실제 화면 밖 아래쪽 500px 영역까지 미리 렌더링
      // endReached 조기 트리거 + 스크롤 버벅임 방지
      overscan={500}
      // 마지막 아이템에 도달했을 때 호출 (다음 페이지 fetch)
      endReached={() => {
        if (hasNextPage && !isFetchingNextPage) onLoadMore?.();
      }}
      className="w-full"
      // 각 아이템의 렌더링 내용 
      // idx: 인덱스, item: 해당 뉴스 데이터
      itemContent={(idx, item) => (
        <div key={`${item.title}-${idx}`} className="pb-2 sm:pb-5">
          <NewsCard
            news={item}
            isTitleOnly={filter.showTitleOnly}
            isPositiveOnly={filter.showPositiveOnly}
          />
        </div>
      )}
      components={{
        // 리스트 맨 하단에 고정으로 렌더링되는 영역 (페이징 중일 때 스피너 표시)
        Footer: () =>
          isFetchingNextPage ? (
            <div className="flex w-full justify-center items-center py-4">
              <SpinnerIcon className="w-8 h-8 text-indigo-400 animate-spin" style={{ animationDuration: '1.5s' }} />
            </div>
          ) : null,
      }}
    />
  );
};

export default NewsList;
