import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { API_ERROR } from '@/constants/api';
import { GET } from './route';

// 실제 Naver·Google을 부르지 않도록 fetch를 가짜로 바꿔서 테스트한다 (API 사용량 없음)

const naverItem = (n: number) => ({
  title: `<b>축제</b> 뉴스 ${n}`,
  originallink: `https://press.example/${n}`,
  link: `https://n.news.naver.com/${n}`,
  description: `설명 &quot;${n}&quot;`,
  pubDate: 'Sat, 07 Nov 2026 09:00:00 +0900',
});

const naverBody = (count: number) => ({
  lastBuildDate: 'Sat, 07 Nov 2026 09:00:00 +0900',
  total: 100,
  start: 1,
  display: count,
  items: Array.from({ length: count }, (_, i) => naverItem(i)),
});

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const googleScore = (score: number) => jsonResponse({ documentSentiment: { score, magnitude: 0.4 } });

const request = (params = 'query=축제&display=2&start=1&sort=sim') =>
  new NextRequest(`http://localhost/api/news?${new URLSearchParams(params)}`);

// 요청 주소로 Naver·Google 응답을 나눠 주는 가짜 fetch
const mockFetch = (handlers: { naver: () => Promise<Response>; google?: (text: string) => Promise<Response> }) => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('openapi.naver.com')) return handlers.naver();
    if (url.includes('language.googleapis.com') && handlers.google) {
      return handlers.google(JSON.parse(String(init?.body)).document.content);
    }
    throw new Error(`예상하지 못한 요청: ${url}`);
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};

beforeEach(() => {
  // 실패 경로에서 route가 남기는 console.error를 테스트 출력에서 숨긴다
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('GET /api/news: 입력 검증 (400)', () => {
  it('검색어가 없으면 400과 틀린 필드를 돌려주고 외부 API를 부르지 않는다', async () => {
    const fetchMock = mockFetch({ naver: async () => jsonResponse(naverBody(2)) });

    const res = await GET(request('display=2&start=1&sort=sim'));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe(API_ERROR.INVALID_PARAMS);
    expect(body.fields.query).toBeDefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('한 번에 받는 개수(display)가 상한(20)을 넘으면 400', async () => {
    mockFetch({ naver: async () => jsonResponse(naverBody(2)) });

    const res = await GET(request('query=축제&display=21&start=1&sort=sim'));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.fields.display).toBeDefined();
  });

  it('허용하지 않는 정렬값이면 400', async () => {
    mockFetch({ naver: async () => jsonResponse(naverBody(2)) });

    const res = await GET(request('query=축제&display=2&start=1&sort=popular'));

    expect(res.status).toBe(400);
  });
});

describe('GET /api/news: Naver 실패', () => {
  it('Naver가 에러로 응답하면 502이고, Naver의 원본 에러 내용은 넘기지 않는다', async () => {
    mockFetch({ naver: async () => jsonResponse({ errorMessage: '내부 정보가 담긴 에러' }, 500) });

    const res = await GET(request());

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: API_ERROR.UPSTREAM_FAILED });
  });

  it('Naver가 제한 시간 안에 응답하지 않으면 504', async () => {
    mockFetch({
      naver: async () => {
        throw new DOMException('The operation was aborted due to timeout', 'TimeoutError');
      },
    });

    const res = await GET(request());

    expect(res.status).toBe(504);
    expect(await res.json()).toEqual({ error: API_ERROR.UPSTREAM_TIMEOUT });
  });

  it('네트워크 오류면 502', async () => {
    mockFetch({
      naver: async () => {
        throw new TypeError('fetch failed');
      },
    });

    const res = await GET(request());

    expect(res.status).toBe(502);
  });
});

describe('GET /api/news: 감정 분석', () => {
  it('기사마다 감정 점수를 붙여 200으로 돌려준다', async () => {
    mockFetch({ naver: async () => jsonResponse(naverBody(2)), google: async () => googleScore(0.3) });

    const res = await GET(request());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.items).toHaveLength(2);
    expect(body.items[0].sentiment).toEqual({ score: 0.3, magnitude: 0.4 });
  });

  it('Google에는 강조 태그·엔티티를 걷어낸 순수 문장을 보낸다', async () => {
    const google = vi.fn(async () => googleScore(0.1));
    mockFetch({ naver: async () => jsonResponse(naverBody(1)), google });

    await GET(request('query=축제&display=1&start=1&sort=sim'));

    expect(google).toHaveBeenCalledWith('축제 뉴스 0 설명 "0"');
  });

  it('일부 기사의 감정 분석이 실패하면 그 기사만 sentiment: null이고 응답은 200', async () => {
    mockFetch({
      naver: async () => jsonResponse(naverBody(3)),
      google: async (text) => (text.includes('뉴스 1') ? jsonResponse({}, 500) : googleScore(-0.4)),
    });

    const res = await GET(request('query=축제&display=3&start=1&sort=sim'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.items.map((item: { sentiment: unknown }) => item.sentiment)).toEqual([
      { score: -0.4, magnitude: 0.4 },
      null,
      { score: -0.4, magnitude: 0.4 },
    ]);
  });
});
