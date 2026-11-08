import { afterEach, describe, expect, it, vi } from 'vitest';
import { analyzeNewsSentimentsByLink } from './news';

const item = (n: number) => ({
  title: `기사 ${n}`,
  link: `https://n.news.naver.com/article/${n}`,
  description: `내용 ${n}`,
  pubDate: 'Sat, 07 Nov 2026 09:00:00 +0900',
});

// 문장에 들어 있는 기사 번호를 점수로 돌려주는 가짜 Google 응답 (기사 3은 분석 실패)
const stubGoogle = () =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const text: string = JSON.parse(String(init?.body)).document.content;
      const n = Number(text.match(/기사 (\d+)/)?.[1]);
      if (n === 3) return new Response('{}', { status: 500 });
      return new Response(JSON.stringify({ documentSentiment: { score: n / 10, magnitude: 0.5 } }));
    }),
  );

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('analyzeNewsSentimentsByLink', () => {
  it('각 기사의 점수를 그 기사의 link에 짝지어 돌려준다', async () => {
    stubGoogle();
    const pending = analyzeNewsSentimentsByLink([item(1), item(2)]);

    expect(Object.keys(pending)).toEqual([item(1).link, item(2).link]);
    expect(await pending[item(1).link]).toEqual({ score: 0.1, magnitude: 0.5 });
    expect(await pending[item(2).link]).toEqual({ score: 0.2, magnitude: 0.5 });
  });

  // 인덱스로 짝짓던 방식의 문제: 화면의 기사 순서가 서버와 다르면 다른 기사의 점수가 붙었다
  it('화면의 기사 순서가 서버와 달라도 link로 찾으면 자기 점수를 받는다', async () => {
    stubGoogle();
    const pending = analyzeNewsSentimentsByLink([item(1), item(2)]);
    const shownInDifferentOrder = [item(2), item(1)];

    const scores = await Promise.all(shownInDifferentOrder.map((news) => pending[news.link]));
    expect(scores.map((s) => s?.score)).toEqual([0.2, 0.1]);
  });

  it('분석에 실패한 기사는 null이고, 서버 목록에 없는 기사는 찾을 수 없다', async () => {
    stubGoogle();
    const pending = analyzeNewsSentimentsByLink([item(1), item(3)]);

    expect(await pending[item(3).link]).toBeNull();
    expect(pending['https://n.news.naver.com/article/999']).toBeUndefined();
  });
});
