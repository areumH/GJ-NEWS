// src/api/server/*: 서버에서 외부 API를 직접 호출하는 함수 (클라이언트에서 import하면 빌드 실패)
import 'server-only';
import { ENV } from '@/config/env';
import { UPSTREAM_TIMEOUT_MS } from '@/constants/api';
import { GoogleSentimentResponse, SentimentValue } from '@/types/sentiment';

// 텍스트 하나의 감정 점수. 같은 텍스트는 'use cache'로 다시 분석하지 않는다
export const analyzeSentiment = async (text: string): Promise<SentimentValue> => {
  'use cache';

  const res = await fetch('https://language.googleapis.com/v2/documents:analyzeSentiment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 키를 URL(?key=)이 아닌 헤더로 보낸다: 에러 메시지·로그에 요청 URL이 찍혀도 키가 노출되지 않는다
      'X-Goog-Api-Key': ENV.GOOGLE_API_KEY,
    },
    body: JSON.stringify({
      encodingType: 'UTF8',
      document: { type: 'PLAIN_TEXT', content: text },
    }),
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });

  // 실패를 반환하면 캐싱되므로 throw한다 (다음 요청에서 다시 분석)
  if (!res.ok) {
    throw new Error(`Google NLP API responded with ${res.status}`);
  }

  const data: GoogleSentimentResponse = await res.json();
  const { score, magnitude } = data.documentSentiment;
  return { score, magnitude };
};
