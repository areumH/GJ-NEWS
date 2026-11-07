# 프로젝트: GJ-NEWS

Naver 검색 API와 Google Natural Language API를 활용한 감정 분석 기반 뉴스 필터링 서비스입니다. Next.js 16 App Router(`cacheComponents` 사용), React 19, TanStack Query v5, react-virtuoso, Zod를 사용합니다.

## 코드 스타일

- 경로 별칭: `@/*` → `src/*` 사용
- 상수는 `src/constants/`에 분리 (메시지, 페이지네이션, API 파라미터 범위·에러 문구, 라우트 경로)
- 환경변수는 `src/config/env.ts`에서 중앙 관리
- 타입은 `src/types/`에 별도 정의
- API 호출 함수는 실행 위치에 따라 나눈다
  - `src/api/client/`: 브라우저에서 내부 API(`/api/*`, Route Handler)를 호출하는 함수. 외부 API·키를 직접 다루지 않는다
  - `src/api/server/`: 서버에서 외부 API(Naver, Google)를 직접 호출하는 함수. 파일 맨 위에 `import 'server-only'`를 둔다
  - 파일 이름은 대상 기준: client는 내부 API 이름(`news.ts` → `/api/news`), server는 외부 서비스 이름(`naver.ts`, `google.ts`). 여러 외부 API를 조합하는 함수는 server의 `news.ts`에 둔다
- TanStack Query 훅은 `src/hooks/api/`, 그 외 훅은 `src/hooks/`에 분리
- 서버 전용 모듈(`config/env.ts`, `api/server/*`, `schemas/*`)에는 `import 'server-only'`를 둔다. 클라이언트 컴포넌트가 import하면 빌드가 실패한다
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
- `/app/api/news`: 뉴스 검색 Route Handler. Naver 검색 결과에 Google 감정 점수를 붙여 반환한다 (Zod로 파라미터 검증, 무한 스크롤 2페이지부터 사용)
- `/components`: UI 컴포넌트
- `/hooks/api`: TanStack Query 기반 데이터 훅 / `/hooks`: 그 외 훅
- `/api/client`: 브라우저 → 내부 API(`/api/*`) 호출 함수 / `/api/server`: 서버 → 외부 API 호출 함수 (서버 전용). URL을 만드는 `/app/api`(Route Handler)와 혼동하지 않는다
- `/schemas`: Zod 검증 스키마 (서버 전용)
- `/providers`: 전역 Provider (React Query)
- `/constants`, `/types`, `/utils`, `/config`
- `src/proxy.ts`: 미들웨어 (`/search` 쿼리 검사)

## 중요 사항

- Naver API 키는 서버 전용(`NAVER_API_CLIENT`, `NAVER_API_CLIENT_KEY`)입니다. `src/api/server/naver.ts`에서만 호출하며, 클라이언트에 노출하지 마세요
- Google API 키는 서버 전용(`GOOGLE_API_KEY`)입니다. `src/api/server/google.ts`에서만 호출하며, 클라이언트에 노출하지 마세요. 키는 URL(`?key=`)이 아니라 `X-Goog-Api-Key` 헤더로 보냅니다 (에러·로그에 URL이 찍혀도 키가 남지 않도록)
- 감정 분석은 서버에서 합니다. 브라우저가 Google을 호출하는 엔드포인트(열린 프록시)를 만들지 마세요
  - 첫 페이지: `search/page.tsx`가 뉴스는 바로 렌더링하고, 감정 점수는 기다리지 않고 Promise 배열(`initialSentiments`)로 넘깁니다. `NewsCard`는 "긍정 뉴스만" 필터가 켜졌을 때만 `use()`로 기다립니다 (분석을 기다리면 첫 검색 LCP가 약 1.1초 늘어남, 실측)
  - 2페이지부터: `/api/news` 응답의 각 기사에 `sentiment`가 들어 있습니다
  - `NewsItem.sentiment`: 값 = 점수, `null` = 분석 실패(부정과 구분), `undefined` = 첫 페이지라 아직 Promise로 오는 중
  - 한 요청이 기사 수만큼 Google을 호출하므로 `display` 상한을 페이지 크기(`PAGE_ELEMENT`)로 제한합니다
- `reactCompiler: true`이므로 `React.memo`, `useMemo`, `useCallback` 수동 최적화는 불필요합니다
- `"use cache"`는 `naver.ts`의 `searchNaverNewsCached`(첫 페이지)와 `google.ts`의 `analyzeSentiment`(같은 텍스트 재분석 방지)에 적용됩니다. 클라이언트 컴포넌트에서는 사용 불가합니다
  - 에러 응답은 반환하지 말고 throw해야 캐싱되지 않습니다
  - `'use cache'` 함수에서 throw된 에러는 프로덕션에서 종류·메시지가 지워진 채 전달됩니다. 에러 종류로 분기해야 하는 곳(`/api/news`의 502/504)은 캐시 없는 함수(`searchNaverNews`)를 씁니다
- `proxy.ts`(미들웨어)에서 `/search` 경로의 쿼리 유효성을 검사하므로, 검색 라우트 변경 시 함께 확인하세요
- 검색 상태는 URL이 기준입니다: `query`, `sort`, 필터(`titleOnly=1`, `positiveOnly=1`). URL은 `PATH.SEARCH()`로 만들고, 필터는 `useSearchFilter` 훅이 `window.history.replaceState`로 바꿉니다(서버 요청 없음). `sort`처럼 임의 문자열이 올 수 있는 값은 `parseSort` 등으로 허용값을 확인하세요
- 레이아웃은 `searchParams`를 받지 못하므로 클라이언트 컴포넌트에서 `useSearchParams()`를 쓰고, `cacheComponents` 환경이라 반드시 Suspense로 감싸세요
- `error.tsx`에서 서버 데이터를 다시 불러오려면 `reset`이 아니라 `retry`를 사용합니다 (Next 16.4)
- `next.config.ts`의 `partialPrefetching: false`는 기존 prefetch 동작 유지용입니다. Next 17에서 기본값이 바뀌므로 변경 시 검토가 필요합니다
- 날짜는 `utils/date.ts`의 `formatDate`(Asia/Seoul 고정)로 표시합니다. `toISOString()`은 UTC라 새벽 기사가 전날로 보입니다
- `NewsList`는 서버 HTML에 첫 페이지 카드를 넣기 위해 react-virtuoso `initialItemCount`를 씁니다. 이와 함께 `endReached`를 쓰면 마운트 시점에 내부적으로 소진돼 무한 스크롤이 멈추므로 쓰지 마세요. 다음 페이지 판정은 `rangeChanged`(평소 스크롤) + `atBottomStateChange`(콘텐츠가 화면보다 짧을 때)로 하고, 두 콜백이 겹쳐도 중복 요청이 없도록 `fetchNextPage({ cancelRefetch: false })`를 씁니다
