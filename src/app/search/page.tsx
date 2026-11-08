import { searchNaverNewsCached } from '@/api/server/naver';
import { analyzeNewsSentimentsByLink } from '@/api/server/news';
import { PAGE_ELEMENT } from '@/constants/pagination';
import { parseSort } from '@/utils/validator';
import NewsSearchClient from '@/components/NewsSearchClient';

export default async function Search({ searchParams }: { searchParams: Promise<{ query?: string; sort?: string }> }) {
  const { query = '', sort: rawSort } = await searchParams;
  // URL의 sort는 임의 문자열일 수 있으므로 허용값 외에는 기본값(sim)으로 처리 (SearchHeader와 같은 규칙)
  const sort = parseSort(rawSort);
  const initialData = query ? await searchNaverNewsCached({ query, display: PAGE_ELEMENT, start: 1, sort }) : null;

  // 첫 페이지의 감정 분석(1건당 약 1.2초)은 기다리지 않고 Promise 그대로 넘긴다
  // → 뉴스 카드는 바로 그려지고, 점수는 끝나는 대로 같은 응답 스트림으로 이어서 전달된다
  // (기다리면 첫 검색의 LCP가 약 1.1초 늘어난다)
  // 카드와는 순서(인덱스)가 아니라 기사 주소(link)로 짝짓는다
  const initialSentiments = initialData ? analyzeNewsSentimentsByLink(initialData.items) : null;

  return <NewsSearchClient query={query} sort={sort} initialData={initialData} initialSentiments={initialSentiments} />;
}
