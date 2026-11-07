import React, { Suspense, use } from 'react';
import { NewsItem } from '@/types/news';
import { SentimentValue } from '@/types/sentiment';
import { isNegative } from '@/utils/sentiment';
import NewsCardLoading from './NewsCardLoading';
import NewsCardContent from './NewsCardContent';
import NewsCardNegative from './NewsCardNegative';
import NewsCardError from './NewsCardError';

export interface NewsCardProps {
  news: NewsItem;
  // 첫 페이지 기사의 감정 점수 (서버에서 스트리밍 중인 Promise). 2페이지부터는 news.sentiment에 이미 들어 있다
  pendingSentiment?: Promise<SentimentValue | null>;
  isTitleOnly: boolean;
  isPositiveOnly: boolean;
}

type CardState = 'visible' | 'hidden' | 'error';

const CARD_CLASS_NAME = 'flex flex-col w-full p-5 sm:p-7 text-left bg-white rounded-lg outline-1 outline-gray-200';

const getCardState = (sentiment: SentimentValue | null, isPositiveOnly: boolean): CardState => {
  if (!isPositiveOnly) return 'visible';
  // null은 분석 실패: 부정으로 취급하지 않고 별도 상태로 보여준다
  if (sentiment === null) return 'error';
  // 부정(score ≤ NEGATIVE_SCORE_THRESHOLD)만 가리고, 중립·긍정은 기사로 보여준다
  return isNegative(sentiment.score) ? 'hidden' : 'visible';
};

interface NewsCardViewProps extends Omit<NewsCardProps, 'pendingSentiment'> {
  sentiment: SentimentValue | null;
}

const NewsCardView = ({ news, sentiment, isTitleOnly, isPositiveOnly }: NewsCardViewProps) => {
  const cardState = getCardState(sentiment, isPositiveOnly);

  const contentMap: Record<CardState, React.ReactNode> = {
    visible: <NewsCardContent news={news} isTitleOnly={isTitleOnly} />,
    hidden: <NewsCardNegative />,
    error: <NewsCardError />,
  };

  // 보이는 기사만 링크로 렌더링한다: 새 탭 열기(Cmd/Ctrl+클릭), 링크 복사, 스크린 리더의 "링크" 안내가 동작한다
  if (cardState === 'visible') {
    return (
      <a
        href={news.link}
        className={`${CARD_CLASS_NAME} sm:hover:outline-3 hover:outline-indigo-100 focus-visible:outline-3 focus-visible:outline-indigo-400`}
      >
        {contentMap[cardState]}
      </a>
    );
  }

  // 부정·분석 실패 상태는 이동할 곳이 없으므로 상호작용 없는 요소로 렌더링한다 (Tab 순서에서도 빠짐)
  return <div className={CARD_CLASS_NAME}>{contentMap[cardState]}</div>;
};

// 점수가 도착할 때까지 use()가 렌더링을 멈추고, 가장 가까운 Suspense가 로딩 카드를 보여준다
const PendingNewsCard = ({ pendingSentiment, ...props }: NewsCardProps & { pendingSentiment: Promise<SentimentValue | null> }) => (
  <NewsCardView {...props} sentiment={use(pendingSentiment)} />
);

const NewsCard = (props: NewsCardProps) => {
  const { news, pendingSentiment, isPositiveOnly } = props;

  // 점수는 "긍정 뉴스만" 필터가 켜졌을 때만 필요하다. 필터가 꺼져 있으면 첫 페이지도 기다리지 않고 바로 그린다
  if (isPositiveOnly && news.sentiment === undefined && pendingSentiment) {
    return (
      <Suspense
        fallback={
          <div className={CARD_CLASS_NAME}>
            <NewsCardLoading />
          </div>
        }
      >
        <PendingNewsCard {...props} pendingSentiment={pendingSentiment} />
      </Suspense>
    );
  }

  // 점수가 없는데 기다릴 Promise도 없으면(정상 흐름에서는 없음) 분석 실패로 처리한다
  return <NewsCardView {...props} sentiment={news.sentiment ?? null} />;
};

export default NewsCard;
