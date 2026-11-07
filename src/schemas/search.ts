// 서버(Route Handler 등)에서만 import한다. 클라이언트 컴포넌트에서 쓰면 zod가 번들에 포함된다 (약 +30KB gzip)
// 'server-only'로 클라이언트 import를 빌드 단계에서 막는다
import 'server-only';
import { z } from 'zod';
import { NEWS_SEARCH_PARAMS } from '@/constants/api';

// 정렬: 허용값('sim' | 'date')만 통과. 기본값 처리가 필요하면 utils/validator.ts의 parseSort 사용
export const sortSchema = z.enum(NEWS_SEARCH_PARAMS.SORTS);

// /api/news 쿼리 파라미터. URLSearchParams 값은 모두 문자열이므로 숫자는 coerce로 변환한다
export const newsSearchParamsSchema = z.object({
  query: z.string().trim().min(1),
  display: z.coerce.number().int().min(NEWS_SEARCH_PARAMS.DISPLAY_MIN).max(NEWS_SEARCH_PARAMS.DISPLAY_MAX),
  start: z.coerce.number().int().min(NEWS_SEARCH_PARAMS.START_MIN).max(NEWS_SEARCH_PARAMS.START_MAX),
  sort: sortSchema,
});

// 검증을 통과한 /api/news 파라미터 타입. 서버 함수(api/server/*)의 인자로도 쓴다
export type NewsSearchQuery = z.infer<typeof newsSearchParamsSchema>;
