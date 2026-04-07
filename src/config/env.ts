/**
 * 환경변수 중앙 관리 (서버 전용)
 * Route Handler 및 서버 컴포넌트에서만 접근 가능합니다.
 */

export const ENV = {
  // Naver API
  NAVER_CLIENT_ID: process.env.NAVER_API_CLIENT || '',
  NAVER_CLIENT_SECRET: process.env.NAVER_API_CLIENT_KEY || '',

  // Google API
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
} as const;
