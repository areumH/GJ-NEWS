import { describe, expect, it } from 'vitest';
import { getCardState } from './index';

const sentiment = (score: number) => ({ score, magnitude: 0.5 });

describe('getCardState', () => {
  it('"긍정 뉴스만" 필터가 꺼져 있으면 점수와 상관없이 기사로 보여준다', () => {
    expect(getCardState(sentiment(-0.9), false)).toBe('visible');
    expect(getCardState(null, false)).toBe('visible');
  });

  it('필터가 켜져 있으면 부정 기사만 가린다', () => {
    expect(getCardState(sentiment(-0.5), true)).toBe('hidden');
    expect(getCardState(sentiment(-0.1), true)).toBe('hidden');
  });

  it('필터가 켜져 있어도 중립·긍정 기사는 보여준다', () => {
    expect(getCardState(sentiment(-0.05), true)).toBe('visible');
    expect(getCardState(sentiment(0), true)).toBe('visible');
    expect(getCardState(sentiment(0.6), true)).toBe('visible');
  });

  // Task 1-4: 분석 실패를 "부정 뉴스"로 보여주던 버그
  it('분석 실패(null)는 부정이 아니라 별도 실패 상태로 보여준다', () => {
    expect(getCardState(null, true)).toBe('error');
  });
});
