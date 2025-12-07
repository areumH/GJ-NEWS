import { useEffect } from 'react';
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

const NewsCard = ({ news, isTitleOnly, isPositiveOnly }: NewsCardProps) => {
  const newsContent = `${news?.title} ${news?.description}`;
  const { mutation } = useAnalyzeSentiment(newsContent);

  useEffect(() => {
    if (mutation.status === 'idle' && !!newsContent.trim()) {
      mutation.mutate();
    }
  }, [mutation, newsContent]);

  const sentimentScore = mutation.data?.documentSentiment.score;
  const isVisible: boolean = isPositiveOnly ? isPositive(sentimentScore || 0) : true;
  const isLoading = !news || (mutation.isPending && isPositiveOnly);

  const handleNewsCard = () => {
    if (!isVisible) return;
    window.location.href = `${news?.link}`;
  };

  const renderContent = () => {
    if (isLoading) {
      return <NewsCardLoading />;
    }

    if (isVisible && news) {
      return <NewsCardContent news={news} isTitleOnly={isTitleOnly} />;
    }

    return <NewsCardNegative />;
  };

  return (
    <button
      onClick={handleNewsCard}
      className="flex flex-col w-full p-5 sm:p-7 text-left bg-white rounded-lg outline-1 sm:hover:outline-3 outline-gray-200  hover:outline-indigo-100 cursor-pointer"
    >
      {renderContent()}
    </button>
  );
};

export default NewsCard;
