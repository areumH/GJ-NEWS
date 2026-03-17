/**
 * 환경변수 중앙 관리
 * Next.js는 빌드 타임에 process.env.NEXT_PUBLIC_* 변수를 문자열로 치환하므로
 * 직접 할당하는 방식으로 구현합니다.
 */

export const ENV = {
  // Naver API
  NAVER_CLIENT_ID: process.env.NEXT_PUBLIC_NAVER_API_CLIENT || '',
  NAVER_CLIENT_SECRET: process.env.NEXT_PUBLIC_NAVER_API_CLIENT_KEY || '',
} as const;
