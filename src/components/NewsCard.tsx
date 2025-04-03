import { NewsItem } from '@/types/news';

export interface NewsCardProps {
  news: NewsItem;
}

// title description originallink link? pubDate

const NewsCard = () => {
  return (
    <button className="flex flex-col w-full p-5 bg-white border-2 border-gray-200">
      <div>2025.02.03</div>
      <div>기사 제목</div>
      <div>기사 내용</div>
    </button>
  );
};

export default NewsCard;
