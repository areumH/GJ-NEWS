import React from 'react';
import { NewsItem } from '@/types/news';
import { isPositive } from '@/utils/validator';
import { stripHtml } from '@/utils/html';
import { useAnalyzeSentiment } from '@/hooks/api/sentiment';
import NewsCardLoading from './NewsCardLoading';
import NewsCardContent from './NewsCardContent';
import NewsCardNegative from './NewsCardNegative';
import NewsCardError from './NewsCardError';

export interface NewsCardProps {
  news?: NewsItem;
  isTitleOnly: boolean;
  isPositiveOnly: boolean;
}

type CardState = 'loading' | 'visible' | 'hidden' | 'error';

const NewsCard = ({ news, isTitleOnly, isPositiveOnly }: NewsCardProps) => {
  // 감정 분석에는 강조 태그(<b>)·엔티티(&quot; 등)를 걷어낸 순수 문장만 보낸다
  const newsContent = news ? stripHtml(`${news.title} ${news.description}`) : '';
  const { data, isPending, isError } = useAnalyzeSentiment(newsContent);

  const sentimentScore = data?.documentSentiment.score;
  const isLoading = !news || (isPending && isPositiveOnly);

  const isAnalysisFailed = isError && isPositiveOnly;
  const isVisible = isPositiveOnly ? isPositive(sentimentScore ?? 0) : true;

  const cardState: CardState = isLoading ? 'loading' : isAnalysisFailed ? 'error' : isVisible ? 'visible' : 'hidden';

  const contentMap: Record<CardState, React.ReactNode> = {
    loading: <NewsCardLoading />,
    visible: news && <NewsCardContent news={news} isTitleOnly={isTitleOnly} />,
    hidden: <NewsCardNegative />,
    error: <NewsCardError />,
  };

  const cardClassName = 'flex flex-col w-full p-5 sm:p-7 text-left bg-white rounded-lg outline-1 outline-gray-200';

  // 보이는 기사만 링크로 렌더링한다: 새 탭 열기(Cmd/Ctrl+클릭), 링크 복사, 스크린 리더의 "링크" 안내가 동작한다
  if (cardState === 'visible' && news) {
    return (
      <a
        href={news.link}
        className={`${cardClassName} sm:hover:outline-3 hover:outline-indigo-100 focus-visible:outline-3 focus-visible:outline-indigo-400`}
      >
        {contentMap[cardState]}
      </a>
    );
  }

  // 로딩·부정·분석 실패 상태는 이동할 곳이 없으므로 상호작용 없는 요소로 렌더링한다 (Tab 순서에서도 빠짐)
  return <div className={cardClassName}>{contentMap[cardState]}</div>;
};

export default NewsCard;
