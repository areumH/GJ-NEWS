import { NewsItem } from '@/types/news';
import { FilterState } from '@/components/FilterOption';
import NewsCard from '@/components/NewsCard';

export default function NewsList({ news, filter }: { news: NewsItem[]; filter: FilterState }) {
  return (
    <div className="flex flex-col w-full gap-2 sm:gap-5">
      {news.map((news, idx) => (
        <NewsCard
          key={`${news.title}-${idx}`}
          news={news}
          isTitleOnly={filter.showTitleOnly}
          isPositiveOnly={filter.showPositiveOnly}
        />
      ))}
    </div>
  );
}
