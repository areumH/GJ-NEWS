import React, { useEffect } from 'react';
import { NewsItem } from '@/types/news';
import { isPositive } from '@/utils/validator';
import { useAnalyzeSentiment } from '@/hooks/api/sentiment';
import NewsCardLoading from './NewsCardLoading';
import NewsCardContent from './NewsCardContent';
import NewsCardNegative from './NewsCardNegative';

export interface NewsCardProps {
  news?: NewsItem;
  isTitleOnly: boolean;
  isPositiveOnly: boolean;
}

type CardState = 'loading' | 'visible' | 'hidden';

const NewsCard = ({ news, isTitleOnly, isPositiveOnly }: NewsCardProps) => {
  const newsContent = news ? `${news.title} ${news.description}` : '';
  const { mutation } = useAnalyzeSentiment(newsContent);

  useEffect(() => {
    if (news) mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sentimentScore = mutation.data?.documentSentiment.score;
  const isLoading = !news || (mutation.isPending && isPositiveOnly);
  const isVisible = isPositiveOnly ? isPositive(sentimentScore ?? 0) : true;

  const cardState: CardState = isLoading ? 'loading' : isVisible ? 'visible' : 'hidden';

  const contentMap: Record<CardState, React.ReactNode> = {
    loading: <NewsCardLoading />,
    visible: news && <NewsCardContent news={news} isTitleOnly={isTitleOnly} />,
    hidden: <NewsCardNegative />,
  };

  const handleNewsCard = () => {
    if (!isVisible) return;
    window.location.href = `${news?.link}`;
  };

  return (
    <button
      onClick={handleNewsCard}
      className="flex flex-col w-full p-5 sm:p-7 text-left bg-white rounded-lg outline-1 sm:hover:outline-3 outline-gray-200  hover:outline-indigo-100 cursor-pointer"
    >
      {contentMap[cardState]}
    </button>
  );
};

export default NewsCard;
