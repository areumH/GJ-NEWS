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

  return res.json();
};
