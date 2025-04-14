import axios from 'axios';
import { AXIOS } from '@/constants/api';

export const axiosNaverInstance = axios.create({
  baseURL: '/naver-api',
  headers: {
    'X-Naver-Client-Id': process.env.NEXT_PUBLIC_NAVER_API_CLIENT,
    'X-Naver-Client-Secret': process.env.NEXT_PUBLIC_NAVER_API_CLIENT_KEY,
  },
  timeout: AXIOS.TIMEOUT,
});
