// 'use cache' 안에서 쓰는 cacheLife는 Next.js 실행 환경 밖(테스트)에서 호출하면 에러를 던진다
// vitest.config.mts에서 next/cache를 이 모듈로 바꿔, 캐시 설정 없이 함수 동작만 테스트한다
export const cacheLife = () => {};
