# 프로젝트: GJ-NEWS

Naver 검색 API와 Google Natural Language API를 활용한 감정 분석 기반 뉴스 필터링 서비스입니다. Next.js 16 App Router(`cacheComponents` 사용), React 19, TanStack Query v5, react-virtuoso, Zod를 사용합니다.

## 코드 스타일

- 경로 별칭: `@/*` → `src/*` 사용
- 상수는 `src/constants/`에 분리 (메시지, 페이지네이션, API 파라미터 범위·에러 문구, 라우트 경로)
- 환경변수는 `src/config/env.ts`에서 중앙 관리
- 타입은 `src/types/`에 별도 정의
- API 호출 함수는 `src/api/`, TanStack Query 훅은 `src/hooks/api/`, 그 외 훅은 `src/hooks/`에 분리
- 검증 스키마(Zod)는 `src/schemas/`에 둔다. **Zod는 서버 코드(Route Handler, 서버 컴포넌트)에서만 import한다.** 클라이언트 컴포넌트에서 쓰면 번들이 약 30KB(gzip) 늘어나므로, 클라이언트에서 필요한 검증은 `src/utils/validator.ts`에 일반 함수로 작성한다
- 조건부 렌더링은 `Record<State, ReactNode>` 맵 패턴 사용
- UI 문자열은 한국어로 `constants/messages.ts`에 관리
- Route Handler 에러 응답은 `{ error: string }` 형식으로 통일한다 (문구는 `constants/api.ts`의 `API_ERROR`)
  - 400: 입력 검증 실패. 어떤 필드가 왜 틀렸는지 `fields`로 함께 반환해도 된다
  - 502: 외부 API 실패, 504: 외부 API 타임아웃(`UPSTREAM_TIMEOUT_MS`)
  - 외부 API의 원본 에러 본문은 클라이언트에 넘기지 않는다
- 커밋 메시지: `feat:` `fix:` `refactor:` `style:` `docs:` `chore:` `test:` + 한국어 제목

## 명령어

- `npm run dev`: 개발 서버 시작 (Turbopack)
- `npm run build`: 프로덕션 빌드 (타입 검사 포함)
- `npm run start`: 프로덕션 서버 시작
- `npm run lint`: ESLint 검사 — **현재 동작하지 않음.** Next 16에서 `next lint`가 제거됐고, `npx eslint .`도 `minimatch` override 문제로 실패한다. 고치기 전까지는 `npm run build`로 확인한다

## 아키텍처

- `/app`: Next.js App Router 페이지 및 레이아웃
- `/app/search/layout.tsx`: 검색 헤더(검색창·정렬·필터). `loading.tsx`·`error.tsx`·`page.tsx`가 바뀌어도 헤더가 유지된다
- `/app/api/news`: Naver 뉴스 검색 Route Handler (Naver API 프록시, Zod로 파라미터 검증)
- `/app/api/sentiment`: 감정 분석 Route Handler (Google NLP API 프록시)
- `/components`: UI 컴포넌트
- `/hooks/api`: TanStack Query 기반 데이터 훅 / `/hooks`: 그 외 훅
- `/api`: API 호출 함수 (`serverSearch.ts`는 서버 전용)
- `/schemas`: Zod 검증 스키마 (서버 전용)
- `/providers`: 전역 Provider (React Query)
- `/constants`, `/types`, `/utils`, `/config`
- `src/proxy.ts`: 미들웨어 (`/search` 쿼리 검사)

## 중요 사항

- Naver API 키는 서버 전용(`NAVER_API_CLIENT`, `NAVER_API_CLIENT_KEY`)입니다. Route Handler(`/api/news`)와 서버 함수를 통해서만 호출하며, 클라이언트에 노출하지 마세요
- Google API 키는 서버 전용(`GOOGLE_API_KEY`)입니다. Route Handler(`/api/sentiment`)를 통해서만 호출하며, 클라이언트에 노출하지 마세요. 키가 요청 URL에 들어가므로 fetch 에러 객체를 그대로 로그에 남기지 마세요
- `reactCompiler: true`이므로 `React.memo`, `useMemo`, `useCallback` 수동 최적화는 불필요합니다
- `"use cache"`는 `src/api/serverSearch.ts`의 서버 함수에 적용됩니다. 클라이언트 컴포넌트에서는 사용 불가합니다. 에러 응답은 반환하지 말고 throw해야 캐싱되지 않습니다
- `proxy.ts`(미들웨어)에서 `/search` 경로의 쿼리 유효성을 검사하므로, 검색 라우트 변경 시 함께 확인하세요
- 검색 상태는 URL이 기준입니다: `query`, `sort`, 필터(`titleOnly=1`, `positiveOnly=1`). URL은 `PATH.SEARCH()`로 만들고, 필터는 `useSearchFilter` 훅이 `window.history.replaceState`로 바꿉니다(서버 요청 없음). `sort`처럼 임의 문자열이 올 수 있는 값은 `parseSort` 등으로 허용값을 확인하세요
- 레이아웃은 `searchParams`를 받지 못하므로 클라이언트 컴포넌트에서 `useSearchParams()`를 쓰고, `cacheComponents` 환경이라 반드시 Suspense로 감싸세요
- `error.tsx`에서 서버 데이터를 다시 불러오려면 `reset`이 아니라 `retry`를 사용합니다 (Next 16.4)
- `next.config.ts`의 `partialPrefetching: false`는 기존 prefetch 동작 유지용입니다. Next 17에서 기본값이 바뀌므로 변경 시 검토가 필요합니다
- 날짜는 `utils/date.ts`의 `formatDate`(Asia/Seoul 고정)로 표시합니다. `toISOString()`은 UTC라 새벽 기사가 전날로 보입니다
- react-virtuoso `initialItemCount`를 `endReached`와 함께 쓰면 마운트 시점에 `endReached`가 소진돼 무한 스크롤이 멈춥니다. 적용하려면 다음 페이지 판정을 `rangeChanged` 등으로 바꿔야 합니다
