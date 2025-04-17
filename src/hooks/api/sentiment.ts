import { useMutation } from '@tanstack/react-query';
import { postAnalyzeSentiment } from '@/api/sentiment';

export const useAnalyzeSentiment = (text: string) => {
  const mutation = useMutation({
    mutationFn: () => postAnalyzeSentiment(text),
  });

  return { mutation };
};
