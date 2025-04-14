import { END_POINT } from '@/constants/api';
import { axiosNaverInstance } from './interceptor';

export const getNewsResult = async (
  query: string,
  display: number,
  start: number,
  sort: string
) => {
  const { data } = await axiosNaverInstance.get(END_POINT.NEWS_SEARCH(query, display, start, sort));

  return data;
};
