// src/api/server/*: 서버에서 외부 API를 직접 호출하는 함수 (클라이언트에서 import하면 빌드 실패)
// news.ts: Naver 검색(naver.ts)과 Google 감정 분석(google.ts)을 조합한다
import 'server-only';
import { SENTIMENT_CONCURRENCY } from '@/constants/api';
import { NaverNewsItem, NewsResponse } from '@/types/news';
import { SentimentValue } from '@/types/sentiment';
import { NewsSearchQuery } from '@/schemas/search';
import { stripHtml } from '@/utils/html';
import { mapWithLimit } from '@/utils/async';
import { searchNaverNews } from './naver';
import { analyzeSentiment } from './google';

// 감정 분석에는 강조 태그(<b>)·엔티티(&quot; 등)를 걷어낸 순수 문장만 보낸다
const toSentimentText = (item: NaverNewsItem) => stripHtml(`${item.title} ${item.description}`);

// 기사마다 감정 점수 Promise를 만든다 (동시 요청 수 제한)
// 실패는 reject 대신 null로 바꿔 해당 기사만 "분석 실패"가 되게 한다 (부정과 구분, 나머지 기사는 영향 없음)
// 실패 로그는 따로 남기지 않는다: 'use cache' 함수(analyzeSentiment)에서 throw된 에러는 Next.js가 서버 로그에 출력한다
export const analyzeNewsSentiments = (items: NaverNewsItem[]): Promise<SentimentValue | null>[] =>
  mapWithLimit(items, SENTIMENT_CONCURRENCY, (item) => analyzeSentiment(toSentimentText(item))).map((promise) =>
    promise.catch(() => null),
  );

// 감정 점수까지 모두 붙인 뉴스 (/api/news: 2페이지부터)
// Naver 검색 실패는 throw → 호출한 쪽에서 502/504로 처리
export const searchNewsWithSentiment = async (params: NewsSearchQuery): Promise<NewsResponse> => {
  const data = await searchNaverNews(params);
  // analyzeNewsSentiments는 실패를 null로 바꾸므로 reject되지 않는다 (allSettled와 같은 효과)
  const sentiments = await Promise.all(analyzeNewsSentiments(data.items));

  return {
    ...data,
    items: data.items.map((item, index) => ({ ...item, sentiment: sentiments[index] })),
  };
};
