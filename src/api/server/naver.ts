// src/api/server/*: 서버에서 외부 API를 직접 호출하는 함수 (클라이언트에서 import하면 빌드 실패)
import 'server-only';
import { NewsResponse } from '@/types/news';
import { ENV } from '@/config/env';
import { PAGE_ELEMENT } from '@/constants/pagination';

export const fetchNewsFirstPage = async (query: string, sort: string): Promise<NewsResponse> => {
  'use cache';

  const res = await fetch(
    `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=${PAGE_ELEMENT}&start=1&sort=${sort}`,
    {
      headers: {
        'X-Naver-Client-Id': ENV.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': ENV.NAVER_CLIENT_SECRET,
      },
    },
  );

  // 에러 응답을 그대로 반환하면 'use cache'에 캐싱되므로 throw한다 (throw된 결과는 캐싱되지 않음)
  if (!res.ok) {
    throw new Error(`Naver news API request failed: ${res.status}`);
  }

  return res.json();
};
