import { describe, expect, it } from 'vitest';
import { NEGATIVE_SCORE_THRESHOLD } from '@/constants/news';
import { isNegative } from './sentiment';

describe('isNegative', () => {
  it('부정 기준값(-0.1) 이하는 부정이다', () => {
    expect(NEGATIVE_SCORE_THRESHOLD).toBe(-0.1);
    expect(isNegative(-0.1)).toBe(true);
    expect(isNegative(-0.5)).toBe(true);
    expect(isNegative(-1)).toBe(true);
  });

  it('기준값보다 크면(중립 포함) 부정이 아니다', () => {
    expect(isNegative(-0.0999)).toBe(false);
    expect(isNegative(0)).toBe(false);
    expect(isNegative(0.3)).toBe(false);
  });

  // 실측 기사 점수
  it('날씨 기사(-0.087)는 부정이 아니고, 추돌사고 기사(-0.161)는 부정이다', () => {
    expect(isNegative(-0.087)).toBe(false);
    expect(isNegative(-0.161)).toBe(true);
  });
});
