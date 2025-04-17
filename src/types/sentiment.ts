export interface SentimentValue {
  magnitude: number;
  score: number;
}

export interface SentimentResponse {
  documentSentiment: SentimentValue;
  languageCode: string;
  sentences: [
    {
      text: {
        content: string;
        beginOffset: number;
      };
      sentiment: SentimentValue;
    }
  ];
  languageSupported: boolean;
}
