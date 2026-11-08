// 테스트(Node 환경)에서는 'server-only'가 "클라이언트에서 import했다"며 에러를 던진다
// vitest.config.ts에서 이 빈 모듈로 바꿔, 서버 전용 파일(api/server/*, schemas/*)도 테스트할 수 있게 한다
export {};
