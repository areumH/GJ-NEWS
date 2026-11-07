import { useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { LOAD_MORE_ROOT_MARGIN, PAGE_ELEMENT } from '@/constants/pagination';
import { NewsItem } from '@/types/news';
import { SentimentValue } from '@/types/sentiment';
import { FilterState } from '@/types/search';
import { useInView } from '@/hooks/useInView';
import { SpinnerIcon } from '@/components/Icon/SpinnerIcon';
import NewsCard from '@/components/NewsCard';

interface NewsListProps {
  news: NewsItem[];
  // 첫 페이지 기사들의 감정 점수 Promise (서버 스트리밍). 인덱스가 news의 앞 20개와 같다
  pendingSentiments?: Promise<SentimentValue | null>[] | null;
  filter: FilterState;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

// Virtuoso가 Footer에 넘겨주는 값 (context prop)
interface ListContext {
  endRef: (node: HTMLDivElement | null) => void;
  isFetchingNextPage?: boolean;
}

// 목록 맨 아래 영역. 컴포넌트를 렌더링 함수 밖에 두고 값은 context로 받는다
// (components에 인라인 함수를 넘기면 렌더링마다 새 컴포넌트가 돼 Footer가 다시 마운트된다)
const ListFooter = ({ context }: { context?: ListContext }) => (
  <>
    {/* 목록 끝 감지 요소: 화면 근처에 들어오면 다음 페이지를 요청한다 */}
    <div ref={context?.endRef} aria-hidden />
    {context?.isFetchingNextPage && (
      <div className="flex w-full justify-center items-center py-4">
        <SpinnerIcon className="w-8 h-8 text-indigo-400 animate-spin" style={{ animationDuration: '1.5s' }} />
      </div>
    )}
  </>
);

const NewsList = ({ news, pendingSentiments, filter, hasNextPage, isFetchingNextPage, onLoadMore }: NewsListProps) => {
  // 기사 수가 바뀌면(새 페이지 도착) 다시 관찰한다: 새 카드로 밀려난 위치를 기준으로 판단하기 위함
  const { ref: endRef, inView: isEndInView } = useInView<HTMLDivElement>({
    rootMargin: LOAD_MORE_ROOT_MARGIN,
    observeKey: news.length,
  });

  // 목록 끝이 화면 근처에 있으면 다음 페이지를 요청한다
  // 새 페이지가 붙은 뒤에도 끝이 여전히 보이면(콘텐츠가 화면보다 짧음) 이어서 요청하고,
  // 화면이 차서 끝이 밖으로 밀려나면 멈춘다
  useEffect(() => {
    if (isEndInView && hasNextPage && !isFetchingNextPage) onLoadMore?.();
  }, [isEndInView, hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <Virtuoso
      // 브라우저 window 스크롤 기준으로 가상화
      useWindowScroll
      // 렌더링할 데이터 배열
      data={news}
      // 서버 렌더링 시 첫 페이지 카드를 HTML에 포함 (기본값 0개면 서버 HTML에 카드가 빠짐)
      // endReached는 쓰지 않는다: initialItemCount와 함께 쓰면 마운트 시점에 내부적으로 한 번 소진돼 무한 스크롤이 멈춘다
      initialItemCount={Math.min(news.length, PAGE_ELEMENT)}
      // 실제 화면 밖 아래쪽 500px 영역까지 미리 렌더링 (스크롤 버벅임 방지)
      overscan={500}
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
      context={{ endRef, isFetchingNextPage }}
      components={{ Footer: ListFooter }}
    />
  );
};

export default NewsList;
