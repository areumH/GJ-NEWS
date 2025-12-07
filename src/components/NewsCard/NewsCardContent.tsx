import { NewsItem } from '@/types/news';
import { formatDate } from '@/utils/date';

interface NewsCardContentProps {
  news: NewsItem;
  isTitleOnly: boolean;
}

const NewsCardContent = ({ news, isTitleOnly }: NewsCardContentProps) => {
  return (
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
  );
};

export default NewsCardContent;
