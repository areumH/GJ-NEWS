import { NewsItem } from '@/types/news';
import { formatDate } from '@/utils/date';

export interface NewsCardProps {
  news: NewsItem;
  isTitleOnly: boolean;
}

const NewsCard = ({ news, isTitleOnly }: NewsCardProps) => {
  const handleNewsCard = () => {
    window.location.href = `${news.link}`;
  };

  return (
    <button
      onClick={handleNewsCard}
      className="flex flex-col w-full p-5 sm:p-7 gap-1 text-left bg-white rounded-lg outline-1 sm:hover:outline-3 outline-gray-200  hover:outline-indigo-100 cursor-pointer"
    >
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
    </button>
  );
};

export default NewsCard;
