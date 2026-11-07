export interface SentimentValue {
  magnitude: number;
  score: number;
}

// Google Natural Language API(v2) analyzeSentiment 응답 중 사용하는 부분
export interface GoogleSentimentResponse {
  documentSentiment: SentimentValue;
  languageCode: string;
  languageSupported: boolean;
}
