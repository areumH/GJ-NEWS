// src/api/client/*: 브라우저에서 내부 API(/api/*, Route Handler)를 호출하는 함수. 외부 API·키를 직접 다루지 않는다
import axios from 'axios';
import { SentimentResponse } from '@/types/sentiment';

export const postAnalyzeSentiment = async (text: string) => {
  const { data } = await axios.post<SentimentResponse>('/api/sentiment', {
    encodingType: 'UTF8',
    document: {
      type: 'PLAIN_TEXT',
      content: text,
    },
  });

  return data;
};
