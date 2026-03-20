import { useQuery } from '@tanstack/react-query';
import { postAnalyzeSentiment } from '@/api/sentiment';

export const useAnalyzeSentiment = (text: string) => {
  return useQuery({
    queryKey: ['sentiment', text],
    queryFn: () => postAnalyzeSentiment(text),
    enabled: !!text,
  });
};
