export interface SentimentValue {
  magnitude: number;
  score: number;
}

// 첫 페이지 기사들의 감정 점수 (서버에서 스트리밍 중인 Promise). 기사 주소(link)를 키로 짝짓는다
// 인덱스로 짝지으면, 브라우저 캐시에 남은 첫 페이지와 서버가 새로 받은 첫 페이지의 기사 순서가 다를 때 다른 기사의 점수가 붙는다
export type PendingSentiments = Record<string, Promise<SentimentValue | null>>;

// Google Natural Language API(v2) analyzeSentiment 응답 중 사용하는 부분
export interface GoogleSentimentResponse {
  documentSentiment: SentimentValue;
  languageCode: string;
  languageSupported: boolean;
}
