# 프로젝트: GJ-NEWS

Naver 검색 API와 Google Natural Language API를 활용한 감정 분석 기반 뉴스 필터링 서비스입니다.

| 분류 | 사용 기술 |
| --- | --- |
| 프레임워크 | Next.js 16 App Router (`cacheComponents`, `reactCompiler` 사용) |
| UI | React 19, Tailwind CSS, react-virtuoso |
| 데이터 | TanStack Query v5 |
| 검증 | Zod (서버 전용) |

## 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 시작 (Turbopack) |
| `npm run build` | 프로덕션 빌드 (타입 검사 포함) |
| `npm run start` | 프로덕션 서버 시작 |
| `npm run lint` | ESLint 검사 (`eslint .`, flat config `eslint.config.mjs`). Next 16에서 `next lint`가 제거돼 eslint CLI로 실행한다 |

변경 후에는 `npm run lint`와 `npm run build`로 확인한다. lint에는 React Compiler 규칙(`react-hooks/purity`, `react-hooks/set-state-in-effect` 등)이 포함된다.

## 폴더 구조

경로 별칭: `@/*` → `src/*`

| 경로 | 역할 |
| --- | --- |
| `app/` | App Router 페이지·레이아웃 |
| `app/search/layout.tsx` | 검색 헤더(검색창·정렬·필터). `loading`·`error`·`page`가 바뀌어도 유지된다 |
| `app/api/news/` | 뉴스 검색 Route Handler. Zod로 파라미터를 검증하고, Naver 결과에 감정 점수를 붙여 반환 (무한 스크롤 2페이지부터) |
| `api/client/` | 브라우저 → 내부 API(`/api/*`) 호출 함수 |
| `api/server/` | 서버 → 외부 API(Naver, Google) 호출 함수 (서버 전용) |
| `schemas/` | Zod 검증 스키마 (서버 전용) |
| `components/` | UI 컴포넌트 |
| `hooks/api/` | TanStack Query 훅 |
| `hooks/` | 그 외 훅 |
| `providers/` | 전역 Provider (React Query) |
| `constants/` | 상수 (메시지, 페이지네이션, API 파라미터 범위·에러 문구, 라우트 경로) |
| `types/` | 타입 정의 |
| `utils/` | 유틸 함수 (`validator.ts`, `date.ts`, `html.ts`, `async.ts`, `storage.ts`, `sentiment.ts`) |
| `config/env.ts` | 환경변수 중앙 관리 (서버 전용) |
| `proxy.ts` | 미들웨어 (`/search` 쿼리 검사) |

> `src/api/`(호출 함수)와 `src/app/api/`(URL을 만드는 Route Handler)를 혼동하지 않는다.

## 코드 규칙

### API 호출 함수

| 위치 | 하는 일 | 파일 이름 기준 |
| --- | --- | --- |
| `api/client/` | 브라우저에서 내부 API를 호출. 외부 API·키를 직접 다루지 않는다 | 내부 API 이름 (`news.ts` → `/api/news`) |
| `api/server/` | 서버에서 외부 API를 호출. 맨 위에 `import 'server-only'` | 외부 서비스 이름 (`naver.ts`, `google.ts`). 여러 API를 조합하는 함수는 `news.ts` |

### 서버 전용 코드

- `config/env.ts`, `api/server/*`, `schemas/*`에는 `import 'server-only'`를 둔다. 클라이언트 컴포넌트가 import하면 빌드가 실패한다
- **Zod는 서버 코드(Route Handler, 서버 컴포넌트)에서만 import한다.** 클라이언트에서 쓰면 번들이 약 30KB(gzip) 늘어난다
  - 클라이언트에서 필요한 검증은 `utils/validator.ts`에 일반 함수로 작성한다 (예: `parseSort`)

### 포맷

- 코드 포맷은 프로젝트 루트의 `.prettierrc`를 따른다 (작은따옴표, 한 줄 120자, 줄바꿈 LF)
- 줄바꿈은 `.gitattributes`(`* text=auto eol=lf`)로 LF로 통일한다. 파일을 통째로 다시 쓸 때도 LF로 저장한다

### 컴포넌트·UI

- 조건부 렌더링은 `Record<State, ReactNode>` 맵 패턴을 쓴다
- UI 문자열은 한국어로 `constants/messages.ts`에 둔다
- `reactCompiler: true`이므로 `React.memo`, `useMemo`, `useCallback`은 쓰지 않는다
- localStorage 값은 effect 안에서 `setState`로 복사하지 않고, `utils/storage.ts`의 `createLocalStorageStore` + `useSyncExternalStore`로 구독한다 (예: `useRecentSearches`)
- 날짜는 `utils/date.ts`의 `formatDate`(Asia/Seoul 고정)로 표시한다. `toISOString()`은 UTC라 새벽 기사가 전날로 보인다

### Route Handler 에러 응답

형식은 `{ error: string }`으로 통일한다. 문구는 `constants/api.ts`의 `API_ERROR`.

| 상태 | 언제 | 비고 |
| --- | --- | --- |
| 400 | 입력 검증 실패 | 어떤 필드가 왜 틀렸는지 `fields`로 함께 반환해도 된다 |
| 502 | 외부 API 실패 | 외부 API의 원본 에러 본문은 클라이언트에 넘기지 않는다 |
| 504 | 외부 API 타임아웃 | 제한 시간은 `UPSTREAM_TIMEOUT_MS` |

### 커밋 메시지

`feat:` `fix:` `refactor:` `style:` `docs:` `chore:` `test:` + 한국어 제목

## 보안: API 키

| 키 | 호출 위치 | 주의 |
| --- | --- | --- |
| `NAVER_API_CLIENT`, `NAVER_API_CLIENT_KEY` | `api/server/naver.ts`만 | 클라이언트에 노출 금지 |
| `GOOGLE_API_KEY` | `api/server/google.ts`만 | 클라이언트에 노출 금지. URL(`?key=`)이 아니라 `X-Goog-Api-Key` 헤더로 보낸다 (에러·로그에 URL이 찍혀도 키가 남지 않도록) |

- 브라우저가 Google을 호출할 수 있는 엔드포인트(열린 프록시)를 만들지 않는다
- 한 요청이 기사 수만큼 Google을 호출하므로 `/api/news`의 `display` 상한은 페이지 크기(`PAGE_ELEMENT`)로 제한한다

## 감정 분석 흐름

감정 분석은 서버에서 하고, 결과를 뉴스 데이터에 붙여 내려준다.

| 구분 | 점수를 받는 방법 |
| --- | --- |
| 첫 페이지 | `search/page.tsx`가 뉴스는 바로 렌더링하고, 점수는 기다리지 않고 Promise 배열(`initialSentiments`)로 넘긴다. `NewsCard`는 "긍정 뉴스만" 필터가 켜졌을 때만 `use()`로 기다린다 |
| 2페이지부터 | `/api/news` 응답의 각 기사에 `sentiment`가 들어 있다 |

> 첫 페이지에서 분석을 기다리면 첫 검색 LCP가 약 1.1초 늘어난다 (실측). 그래서 스트리밍으로 보낸다.

부정 판정은 `utils/sentiment.ts`의 `isNegative`로 한다. `score ≤ NEGATIVE_SCORE_THRESHOLD`(-0.1, `constants/news.ts`)만 부정이고, 중립(0 근처)은 긍정과 같이 기사로 보여준다. "긍정 뉴스만" 필터는 부정 기사만 가린다. `magnitude`는 판정에 쓰지 않는다 (제목·요약만 분석해 값이 작고, 결과에 거의 영향이 없음).

`NewsItem.sentiment` 값의 의미:

| 값 | 의미 |
| --- | --- |
| `{ score, magnitude }` | 분석 성공 |
| `null` | 분석 실패. "부정"과 구분해서 보여준다 |
| `undefined` | 첫 페이지라 점수가 아직 Promise로 오는 중 |

## 캐시 (`'use cache'`)

| 함수 | 용도 |
| --- | --- |
| `naver.ts`의 `searchNaverNewsCached` | 첫 페이지 Naver 검색 |
| `google.ts`의 `analyzeSentiment` | 같은 텍스트 재분석 방지 |

- 클라이언트 컴포넌트에서는 쓸 수 없다
- 에러 응답은 반환하지 말고 throw한다 (throw된 결과는 캐싱되지 않는다)
- `'use cache'` 함수에서 throw된 에러는 **프로덕션에서 종류·메시지가 지워진 채** 전달된다. 에러 종류로 분기해야 하는 곳(`/api/news`의 502/504)은 캐시 없는 `searchNaverNews`를 쓴다

## 검색 상태 (URL 기준)

| 값 | URL 쿼리 | 바꾸는 방법 |
| --- | --- | --- |
| 검색어 | `query` | `router.push(PATH.SEARCH(...))` |
| 정렬 | `sort` (`sim` \| `date`) | `router.push(PATH.SEARCH(...))` |
| 필터 | `titleOnly=1`, `positiveOnly=1` | `useSearchFilter`가 `window.history.replaceState`로 변경 (서버 요청 없음) |

- URL은 `PATH.SEARCH()`로 만든다
- `sort`처럼 임의 문자열이 올 수 있는 값은 `parseSort` 등으로 허용값을 확인한다
- `proxy.ts`가 `/search` 쿼리를 검사하므로, 검색 라우트를 바꾸면 함께 확인한다

## Next.js 주의 사항

| 항목 | 규칙 |
| --- | --- |
| 레이아웃의 쿼리 | 레이아웃은 `searchParams`를 받지 못한다. 클라이언트 컴포넌트에서 `useSearchParams()`를 쓰고, `cacheComponents` 환경이라 반드시 Suspense로 감싼다 |
| `error.tsx` 재시도 | 서버 데이터를 다시 불러오려면 `reset`이 아니라 `retry`를 쓴다 (Next 16.4) |
| `partialPrefetching: false` | 기존 prefetch 동작 유지용. Next 17에서 기본값이 바뀌므로 변경 시 검토한다 |

## 무한 스크롤 (`NewsList`)

| 하는 것 | 하지 않는 것 |
| --- | --- |
| 서버 HTML에 첫 페이지 카드를 넣기 위해 Virtuoso `initialItemCount`를 쓴다 | `endReached`: `initialItemCount`와 함께 쓰면 마운트 시점에 소진돼 무한 스크롤이 멈춘다 |
| 다음 페이지 판정은 `Footer`의 목록 끝 감지 요소 + IntersectionObserver(`hooks/useInView`)로 한다 | Virtuoso 콜백(`rangeChanged`, `atBottomStateChange`)으로 판정: 마운트 직후 아이템 높이를 재기 전에 잘못된 값을 보내 스크롤 전에 2페이지를 요청한 적이 있다 |
| `useInView`의 `observeKey`에 기사 수를 넘겨, 새 페이지가 붙으면 다시 관찰한다 | 이전 관찰 결과("보임")를 그대로 쓰기: 매번 한 페이지씩 더 불러온다 |
| `Footer`는 렌더링 함수 밖에 정의하고 값은 Virtuoso `context`로 넘긴다 | `components`에 인라인 컴포넌트 넘기기: 렌더링마다 다시 마운트된다 |
