import { NewsItem } from '@/types/news';
import { formatDate } from '@/utils/date';
import { parseHighlight } from '@/utils/html';

interface NewsCardContentProps {
  news: NewsItem;
  isTitleOnly: boolean;
}

// Naver 응답을 HTML로 주입하지 않고 텍스트로 렌더링한다. 검색어 강조(<b>)만 <strong>으로 살린다
const HighlightedText = ({ html }: { html: string }) => (
  <>
    {parseHighlight(html).map((segment, idx) =>
      segment.highlighted ? <strong key={idx}>{segment.text}</strong> : segment.text,
    )}
  </>
);

const NewsCardContent = ({ news, isTitleOnly }: NewsCardContentProps) => {
  return (
    <div className="flex flex-col w-full gap-1">
      <div className="w-full text-sm sm:text-lg text-gray-400">{formatDate(news.pubDate)}</div>
      <div className="w-full text-lg sm:text-2xl text-indigo-800 font-semibold line-clamp-2 leading-snug">
        <HighlightedText html={news.title} />
      </div>
      {!isTitleOnly && (
        <div className="w-full sm:text-lg text-gray-700 line-clamp-3 leading-snug">
          <HighlightedText html={news.description} />
        </div>
      )}
    </div>
  );
};

export default NewsCardContent;
