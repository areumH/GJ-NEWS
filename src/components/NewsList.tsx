import { Virtuoso } from 'react-virtuoso';
import { PAGE_ELEMENT } from '@/constants/pagination';
import { NewsItem } from '@/types/news';
import { SentimentValue } from '@/types/sentiment';
import { FilterState } from '@/types/search';
import NewsCard from '@/components/NewsCard';
import { SpinnerIcon } from '@/components/Icon/SpinnerIcon';

interface NewsListProps {
  news: NewsItem[];
  // 첫 페이지 기사들의 감정 점수 Promise (서버 스트리밍). 인덱스가 news의 앞 20개와 같다
  pendingSentiments?: Promise<SentimentValue | null>[] | null;
  filter: FilterState;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

const NewsList = ({ news, pendingSentiments, filter, hasNextPage, isFetchingNextPage, onLoadMore }: NewsListProps) => {
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) onLoadMore?.();
  };

  return (
    <Virtuoso
      // 브라우저 window 스크롤 기준으로 가상화
      useWindowScroll
      // 렌더링할 데이터 배열
      data={news}
      // 서버 렌더링 시 첫 페이지 카드를 HTML에 포함 (기본값 0개면 서버 HTML에 카드가 빠짐)
      initialItemCount={Math.min(news.length, PAGE_ELEMENT)}
      // 실제 화면 밖 아래쪽 500px 영역까지 미리 렌더링
      // 다음 페이지 조기 요청 + 스크롤 버벅임 방지
      overscan={500}
      // 렌더링 범위에 마지막 아이템이 들어오면 다음 페이지 fetch
      // endReached는 쓰지 않는다: initialItemCount와 함께 쓰면 마운트 시점에 내부적으로 한 번 소진되고
      // (콜백 연결 전이라 호출되지 않음) 같은 전체 개수에서는 다시 발생하지 않아 무한 스크롤이 멈춘다
      rangeChanged={({ endIndex }) => {
        if (endIndex >= news.length - 1) loadMore();
      }}
      // 콘텐츠가 화면보다 짧아 스크롤할 수 없으면 렌더링 범위가 바뀌지 않아 rangeChanged가 오지 않는다
      // → 스크롤이 바닥에 있는 상태(atBottom)로도 다음 페이지를 요청한다
      atBottomStateChange={(atBottom) => {
        if (atBottom) loadMore();
      }}
      className="w-full"
      // 각 아이템의 렌더링 내용 
      // idx: 인덱스, item: 해당 뉴스 데이터
      itemContent={(idx, item) => (
        <div key={`${item.title}-${idx}`} className="pb-2 sm:pb-5">
          <NewsCard
            news={item}
            pendingSentiment={pendingSentiments?.[idx]}
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
