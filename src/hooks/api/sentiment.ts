import { useQuery } from '@tanstack/react-query';
import { postAnalyzeSentiment } from '@/api/client/sentiment';

export const useAnalyzeSentiment = (text: string) => {
  return useQuery({
    queryKey: ['sentiment', text],
    queryFn: () => postAnalyzeSentiment(text),
    enabled: !!text,
    // 같은 텍스트의 감정 점수는 바뀌지 않으므로 재요청하지 않음
    staleTime: Infinity,
  });
};
