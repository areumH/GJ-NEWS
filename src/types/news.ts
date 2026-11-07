import { SentimentValue } from '@/types/sentiment';

// Naver 뉴스 검색 API 응답 원본
export interface NaverNewsItem {
  title: string;
  originallink?: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface NaverNewsResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverNewsItem[];
}

// 감정 분석 결과가 붙은 뉴스
export interface NewsItem extends NaverNewsItem {
  // 값: 감정 점수 / null: 분석 실패 (부정과 구분한다)
  // undefined: 첫 페이지(서버 렌더링)라 점수가 아직 붙지 않음 → 점수는 initialSentiments(Promise)로 따로 스트리밍된다
  // /api/news 응답(2페이지부터)에는 항상 값 또는 null이 있다
  sentiment?: SentimentValue | null;
}

export interface NewsResponse extends Omit<NaverNewsResponse, 'items'> {
  items: NewsItem[];
}
