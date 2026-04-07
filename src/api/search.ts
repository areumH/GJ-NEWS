import { NewsResponse } from '@/types/news';

export const getNewsResult = async (
  query: string,
  display: number,
  start: number,
  sort: string
): Promise<NewsResponse> => {
  const params = new URLSearchParams({
    query,
    display: String(display),
    start: String(start),
    sort,
  });

  const res = await fetch(`/api/news?${params}`);
  return res.json();
};
