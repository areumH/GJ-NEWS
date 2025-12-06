import { useMutation } from '@tanstack/react-query';
import { postAnalyzeSentiment } from '@/api/sentiment';
import { useToast } from '@/hooks/useToast';

export const useAnalyzeSentiment = (text: string) => {
  const mutation = useMutation({
    mutationFn: () => postAnalyzeSentiment(text),
    onError: () => {
      useToast({ message: '감정 분석 중 오류가 발생했습니다. ' });
    },
  });

  return { mutation };
};
