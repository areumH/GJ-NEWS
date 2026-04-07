![image](https://github.com/user-attachments/assets/dade2290-d7bc-4abf-ba2c-6d06c4bf2069)

# GJ-NEWS

> 긍정 뉴스만 뽑아보자!

Naver 검색 API와 Google Natural Language API를 활용한 감정 분석 기반 뉴스 필터링 서비스.
키워드로 뉴스를 검색하고, 감정 분석을 통해 긍정적인 뉴스만 선별하여 보여준다.

## 주요 기능

- **실시간 뉴스 검색**: Naver 검색 API를 통한 최신 뉴스 검색
- **감정 분석**: Google Natural Language API로 뉴스 감정 점수 분석
- **긍정 뉴스 필터링**: 긍정적인 뉴스만 선별하여 표시
- **최근 검색어**: 검색어 히스토리 (최대 10개)
- **무한 스크롤**: react-virtuoso 가상화 기반의 끊김 없는 뉴스 탐색
- **정렬 옵션**: 정확도순 / 최신순 정렬
- **반응형 디자인**: 모바일/태블릿/데스크톱 모두 지원

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| 서버 상태 관리 | TanStack Query (React Query) |
| HTTP Client | Axios |
| 가상화 | react-virtuoso |
| Toast UI | Sonner |
| API | Naver Search API, Google Natural Language API |

## 설치 및 실행

```bash
npm install
```

개발 서버 실행:

```bash
npm run dev
```

프로덕션 빌드 및 실행:

```bash
npm run build
npm run start
```

린트 검사:

```bash
npm run lint
```

### 환경 변수

프로젝트 실행에 아래 환경 변수가 필요하다:

| 변수명 | 설명 |
|--------|------|
| `NAVER_CLIENT_ID` | Naver 검색 API 클라이언트 ID |
| `NAVER_CLIENT_SECRET` | Naver 검색 API 클라이언트 시크릿 |
| `GOOGLE_API_KEY` | Google Natural Language API 키 (서버 전용) |

## 프로젝트 구조

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx                # 메인 페이지
│   ├── not-found.tsx           # 404 페이지
│   ├── api/news/               # 뉴스 검색 Route Handler
│   ├── api/sentiment/          # 감정 분석 Route Handler
│   └── search/                 # 검색 결과 페이지
├── api/                        # API 호출 로직
│   ├── search.ts               # 뉴스 검색 (클라이언트)
│   ├── serverSearch.ts         # 뉴스 검색 (서버, "use cache")
│   └── sentiment.ts            # 감정 분석
├── components/                 # UI 컴포넌트
├── hooks/                      # Custom Hooks
│   ├── useRecentSearches.ts    # 최근 검색어
│   └── api/                    # TanStack Query 기반 데이터 훅
├── constants/                  # 상수 정의
├── config/                     # 환경 변수 설정
├── types/                      # TypeScript 타입 정의
├── utils/                      # 유틸리티 함수
└── proxy.ts                    # 검색 라우트 쿼리 유효성 검사 미들웨어
```
