# 프로젝트: GJ-NEWS

Naver 검색 API와 Google Natural Language API를 활용한 감정 분석 기반 뉴스 필터링 서비스입니다. Next.js 16 App Router, TanStack Query v5, react-virtuoso를 사용합니다.

## 코드 스타일

- 경로 별칭: `@/*` → `src/*` 사용
- 상수는 `src/constants/`에 분리 (메시지, 페이지네이션, API 엔드포인트, 라우트 경로)
- 환경변수는 `src/config/env.ts`에서 중앙 관리
- 타입은 `src/types/`에 별도 정의
- API 호출 함수는 `src/api/`, 관련 훅은 `src/hooks/api/`에 분리
- 조건부 렌더링은 `Record<State, ReactNode>` 맵 패턴 사용
- UI 문자열은 한국어로 `constants/messages.ts`에 관리

## 명령어

- `npm run dev`: 개발 서버 시작 (Turbopack)
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버 시작
- `npm run lint`: ESLint 검사

## 아키텍처

- `/app`: Next.js App Router 페이지 및 레이아웃
- `/app/api/sentiment`: 감정 분석 Route Handler (Google NLP API 프록시)
- `/components`: UI 컴포넌트
- `/hooks/api`: TanStack Query 기반 데이터 훅
- `/api`: API 호출 함수 및 Axios 인스턴스
- `/constants`: 상수 정의

## 중요 사항

- Naver API는 rewrites 프록시(`/naver-api/*`)로 통신합니다. `next.config.ts`와 `vercel.json` 양쪽에 설정되어 있으므로 변경 시 둘 다 수정하세요
- Google API 키는 서버 전용(`GOOGLE_API_KEY`)입니다. Route Handler를 통해서만 호출하며, 클라이언트에 노출하지 마세요
- `reactCompiler: true`이므로 `React.memo`, `useMemo`, `useCallback` 수동 최적화는 불필요합니다
- `"use cache"`는 `src/api/serverSearch.ts`의 서버 함수에 적용됩니다. 클라이언트 컴포넌트에서는 사용 불가합니다
- `proxy.ts`(미들웨어)에서 `/search` 경로의 쿼리 유효성을 검사하므로, 검색 라우트 변경 시 함께 확인하세요
