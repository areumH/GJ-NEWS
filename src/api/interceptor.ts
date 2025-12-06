import axios from 'axios';
import { AXIOS } from '@/constants/api';
import { ENV } from '@/config/env';

export const axiosNaverInstance = axios.create({
  baseURL: '/naver-api',
  headers: {
    'X-Naver-Client-Id': ENV.NAVER_CLIENT_ID,
    'X-Naver-Client-Secret': ENV.NAVER_CLIENT_SECRET,
  },
  timeout: AXIOS.TIMEOUT,
});

export const axiosGoogleInstance = axios.create({
  baseURL: '/google-api',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  timeout: AXIOS.TIMEOUT,
});
