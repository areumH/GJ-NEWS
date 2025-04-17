import { END_POINT } from '@/constants/api';
import { axiosGoogleInstance } from './interceptor';

export const postAnalyzeSentiment = async (text: string) => {
  const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';

  const { data } = await axiosGoogleInstance.post<number>(END_POINT.ANALYZE_SENTIMENT(key), {
    encodingType: 'UTF8',
    document: {
      type: 'PLAIN_TEXT',
      content: text,
    },
  });

  return data;
};
