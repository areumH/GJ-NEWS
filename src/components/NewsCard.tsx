import { NewsItem } from '@/types/news';

export interface NewsCardProps {
  news: NewsItem;
  isTitleOnly: boolean;
}

// title description originallink link? pubDate

const NewsCard = ({ isTitleOnly }: { isTitleOnly: boolean }) => {
  return (
    <button className="flex flex-col w-full p-5 sm:p-7 gap-1 text-left bg-white rounded-lg outline-1 sm:hover:outline-3 outline-gray-200  hover:outline-indigo-100 cursor-pointer">
      <div className="w-full text-sm sm:text-lg text-gray-400">2025.02.03</div>
      <div className="w-full text-lg sm:text-2xl text-indigo-800 font-semibold line-clamp-2 leading-snug">
        기사 제목
      </div>
      {!isTitleOnly && (
        <div className="w-full sm:text-lg text-gray-700 line-clamp-3 leading-snug">기사 내용</div>
      )}
    </button>
  );
};

export default NewsCard;
