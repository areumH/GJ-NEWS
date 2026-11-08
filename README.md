![image](https://github.com/user-attachments/assets/dade2290-d7bc-4abf-ba2c-6d06c4bf2069)

# GJ-NEWS

> 긍정 뉴스만 뽑아보자!

키워드로 뉴스를 검색하면 기사마다 감정을 분석해, 원하면 긍정적인 뉴스만 골라 보여주는 서비스입니다.
뉴스 검색은 Naver 검색 API, 감정 분석은 Google Natural Language API를 사용합니다.

## 주요 기능

- **뉴스 검색**: 정확도순 / 최신순 정렬, 무한 스크롤 (react-virtuoso 가상화)
- **긍정 뉴스 필터**: 감정 점수가 긍정인 기사만 표시. 분석 실패는 부정과 구분해 안내
- **제목만 보기**: 본문 요약을 숨기고 제목만 표시
- **최근 검색어**: 최대 10개 저장, 키보드로 선택·삭제 가능
- **검색 상태 공유**: 검색어·정렬·필터가 URL에 남아 새로고침·링크 공유 시 유지
- **접근성**: 기사 카드는 링크(새 탭 열기 지원), 검색창·필터에 스크린 리더용 이름과 상태 제공

## 동작 방식

API 키는 서버에서만 사용하며, 브라우저는 외부 API를 직접 호출하지 않습니다.

| 구분 | 처리 |
| --- | --- |
| 첫 페이지 | 서버가 Naver 검색 결과를 바로 렌더링하고, 감정 분석 결과는 끝나는 대로 같은 응답으로 스트리밍 |
| 다음 페이지 | `/api/news`가 Naver 검색 결과에 감정 점수를 붙여 반환 |
| 감정 분석 | 서버에서 기사별로 동시에 요청하고, 같은 문장은 캐시(`'use cache'`)해 다시 분석하지 않음 |
| 필터 전환 | 이미 받은 점수로 브라우저에서 바로 적용 (서버 요청 없음) |

## 기술 스택

| 분류 | 기술 |
| --- | --- |
| Framework | Next.js (App Router, Cache Components, React Compiler) |
| Language | TypeScript |
| UI | React, Tailwind CSS, Sonner (토스트) |
| 서버 상태 관리 | TanStack Query |
| 가상화 | react-virtuoso |
| 검증 | Zod (서버 전용) |
| 테스트 | Vitest |
| 외부 API | Naver Search API, Google Natural Language API |

## 시작하기

Node.js 20.9 이상이 필요합니다 (Next.js 16 요구 사항).

```bash
npm install
```

프로젝트 루트에 `.env.local`을 만들고 아래 환경 변수를 설정합니다. 모두 서버 전용입니다.

| 변수명 | 설명 |
| --- | --- |
| `NAVER_API_CLIENT` | Naver 검색 API 클라이언트 ID |
| `NAVER_API_CLIENT_KEY` | Naver 검색 API 클라이언트 시크릿 |
| `GOOGLE_API_KEY` | Google Natural Language API 키 |

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드 (타입 검사 포함)
npm run start    # 프로덕션 서버
npm run lint     # ESLint 검사
npm test         # 테스트 (Vitest)
```

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 메인 (검색 시작)
│   ├── search/               # 검색 결과 (layout: 검색 헤더, page·loading·error)
│   └── api/news/             # 뉴스 검색 Route Handler (감정 점수 포함)
├── api/
│   ├── client/               # 브라우저 → 내부 API (/api/news)
│   └── server/               # 서버 → 외부 API (server-only)
│       ├── naver.ts          #   Naver 뉴스 검색
│       ├── google.ts         #   Google 감정 분석
│       └── news.ts           #   뉴스 + 감정 점수 조합
├── components/               # UI 컴포넌트 (NewsCard, NewsList, SearchBar …)
├── hooks/
│   ├── api/                  # TanStack Query 훅
│   └── *.ts                  # 최근 검색어, 필터(URL), 화면 진입 감지
├── schemas/                  # Zod 검증 스키마 (서버 전용)
├── constants/                # 메시지, 페이지네이션, API 파라미터, 라우트
├── types/                    # 타입 정의
├── utils/                    # 날짜(KST), HTML 파싱, 동시 요청 제한, localStorage 구독, 검증
├── config/env.ts             # 환경 변수 (서버 전용)
├── providers/                # React Query Provider
└── proxy.ts                  # /search 쿼리 검사 (미들웨어)
```
