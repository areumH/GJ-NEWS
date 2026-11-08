import { NewsItem } from '@/types/news';
import { formatDate } from '@/utils/date';
import { parseHighlight } from '@/utils/html';
import { getSourceDomain } from '@/utils/url';

interface NewsCardContentProps {
  news: NewsItem;
  isTitleOnly: boolean;
}

// Naver 응답을 HTML로 주입하지 않고 텍스트로 렌더링한다. 검색어 강조(<b>)만 <strong>으로 살린다
const HighlightedText = ({ html }: { html: string }) => (
  <>
    {parseHighlight(html).map((segment, idx) =>
      segment.highlighted ? (
        <strong key={idx} className="font-semibold text-indigo-600">
          {segment.text}
        </strong>
      ) : (
        segment.text
      ),
    )}
  </>
);

const NewsCardContent = ({ news, isTitleOnly }: NewsCardContentProps) => {
  // 원문 주소(언론사)가 없으면 Naver 뉴스 주소의 도메인을 쓴다
  const source = getSourceDomain(news.originallink || news.link);

  return (
    <div className="flex flex-col w-full gap-1.5">
      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
        {source && (
          <>
            <span className="truncate">{source}</span>
            <span aria-hidden className="text-gray-300">
              ·
            </span>
          </>
        )}
        <span className="shrink-0">{formatDate(news.pubDate)}</span>
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 leading-snug">
        <HighlightedText html={news.title} />
      </h3>
      {!isTitleOnly && (
        <p className="text-sm sm:text-base text-gray-600 line-clamp-2 leading-relaxed">
          <HighlightedText html={news.description} />
        </p>
      )}
    </div>
  );
};

export default NewsCardContent;
