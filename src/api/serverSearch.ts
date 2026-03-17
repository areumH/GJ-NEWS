import { NewsResponse } from '@/types/news';
import { PAGE_ELEMENT } from '@/constants/pagination';

export const fetchNewsFirstPage = async (query: string, sort: string): Promise<NewsResponse> => {
  'use cache';

  const res = await fetch(
    `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=${PAGE_ELEMENT}&start=1&sort=${sort}`,
    {
      headers: {
        'X-Naver-Client-Id': process.env.NEXT_PUBLIC_NAVER_API_CLIENT!,
        'X-Naver-Client-Secret': process.env.NEXT_PUBLIC_NAVER_API_CLIENT_KEY!,
      },
    },
  );

  return res.json();
};
