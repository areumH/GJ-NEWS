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
