// src/api/client/*: 브라우저에서 내부 API(/api/*, Route Handler)를 호출하는 함수. 외부 API·키를 직접 다루지 않는다
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
  // fetch는 4xx/5xx에서 reject하지 않으므로 직접 throw해야 React Query가 에러로 처리한다
  if (!res.ok) {
    throw new Error(`News search request failed: ${res.status}`);
  }
  return res.json();
};
