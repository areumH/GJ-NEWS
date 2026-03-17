![image](https://github.com/user-attachments/assets/dade2290-d7bc-4abf-ba2c-6d06c4bf2069)

# GJ-NEWS

> 긍정 뉴스만 뽑아보자!

Google Natural Language API를 활용한 감정 분석 기반 뉴스 필터링 서비스

## ✨ 주요 기능

- **실시간 뉴스 검색**: Naver 검색 API를 통한 최신 뉴스 검색
- **감정 분석**: Google Natural Language API로 뉴스 감정 점수 분석
- **긍정 뉴스 필터링**: 긍정적인 뉴스만 선별하여 표시
- **최근 검색어**: 검색어 히스토리 (최대 10개)
- **무한 스크롤**: 끊김 없는 뉴스 탐색 경험
- **정렬 옵션**: 정확도순 / 최신순 정렬
- **반응형 디자인**: 모바일/태블릿/데스크톱 모두 지원

## 🛠 기술 스택

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **APIs**:
  - Naver Search API (뉴스 검색)
  - Google Natural Language API (감정 분석)

## 프로젝트 구조

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx                # 메인 페이지 (서버 컴포넌트)
│   ├── not-found.tsx           # 404 페이지 (서버 컴포넌트)
│   ├── api/
│   │   └── sentiment/
│   │       └── route.ts        # 감정 분석 Route Handler
│   └── search/
│       ├── page.tsx            # 검색 결과 페이지 (서버 컴포넌트)
│       └── loading.tsx         # 로딩 UI
├── api/                        # API 호출 로직
│   ├── interceptor.ts          # Axios 인스턴스 (Naver)
│   ├── search.ts               # 뉴스 검색 (클라이언트)
│   ├── serverSearch.ts         # 뉴스 검색 (서버, "use cache")
│   └── sentiment.ts            # 감정 분석
├── components/                 # 재사용 컴포넌트
│   ├── NewsCard/               # 뉴스 카드
│   ├── NewsList.tsx            # 뉴스 리스트
│   ├── NewsSearchClient.tsx    # 검색 결과 클라이언트 컴포넌트
│   ├── SearchBar.tsx           # 검색바 (최근 검색어 포함)
│   └── FilterOption.tsx        # 필터 옵션
├── hooks/                      # Custom Hooks
│   ├── useRecentSearches.ts    # 최근 검색어 훅
│   └── api/                    # API 관련 훅
├── types/                      # TypeScript 타입 정의
├── utils/                      # 유틸리티 함수
└── constants/                  # 상수 정의
```
