import { useEffect } from 'react';
import Image from 'next/image';
import { NewsItem } from '@/types/news';
import { formatDate } from '@/utils/date';
import { isPositive } from '@/utils/validator';
import { MESSAGE } from '@/constants/messages';
import { useAnalyzeSentiment } from '@/hooks/api/sentiment';

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

  const handleNewsCard = () => {
    if (isVisible) window.location.href = `${news?.link}`;
  };

  return (
    <button
      onClick={handleNewsCard}
      className="flex flex-col w-full p-5 sm:p-7 text-left bg-white rounded-lg outline-1 sm:hover:outline-3 outline-gray-200  hover:outline-indigo-100 cursor-pointer"
    >
      {mutation.isPending || !news ? (
        <div className="flex w-full h-26 justify-center items-center">
          <div className="relative w-6 h-6 sm:w-7 sm:h-7">
            <Image src="/images/loading.gif" alt="로딩 중" fill className="object-contain" />
          </div>
        </div>
      ) : isVisible ? (
        <div className="flex flex-col w-full gap-1">
          <div className="w-full text-sm sm:text-lg text-gray-400">{formatDate(news.pubDate)}</div>
          <div
            className="w-full text-lg sm:text-2xl text-indigo-800 font-semibold line-clamp-2 leading-snug"
            dangerouslySetInnerHTML={{ __html: news.title }}
          ></div>
          {!isTitleOnly && (
            <div
              className="w-full sm:text-lg text-gray-700 line-clamp-3 leading-snug"
              dangerouslySetInnerHTML={{ __html: news.description }}
            ></div>
          )}
        </div>
      ) : (
        <div className="flex w-full h-26 justify-center items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative w-8 h-8 sm:w-11 sm:h-11">
              <Image src="/images/devil.png" alt="부정 뉴스" fill className="object-contain" />
            </div>
            <p className="text-gray-500 sm:text-lg">{MESSAGE.NEGATIVE}</p>
          </div>
        </div>
      )}
    </button>
  );
};

export default NewsCard;
