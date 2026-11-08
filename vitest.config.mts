import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      // tsconfig의 @/* → src/* 경로 별칭
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'server-only': fileURLToPath(new URL('./test/server-only-stub.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    // 테스트 파일은 대상 파일 옆에 둔다 (예: src/utils/date.test.ts)
    include: ['src/**/*.test.ts'],
  },
});
