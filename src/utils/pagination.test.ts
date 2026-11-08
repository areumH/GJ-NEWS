import { describe, expect, it } from 'vitest';
import { getNextPageStart } from './pagination';

describe('getNextPageStart', () => {
  it('불러온 페이지 수 × 페이지 크기 다음 위치를 돌려준다', () => {
    expect(getNextPageStart(1, 20, 500)).toBe(21);
    expect(getNextPageStart(3, 20, 500)).toBe(61);
  });

  // Naver API는 1000번째 결과까지만 제공한다
  it('1000번째 결과를 넘어가면 더 불러오지 않는다', () => {
    expect(getNextPageStart(49, 20, 5000)).toBe(981);
    expect(getNextPageStart(50, 20, 5000)).toBeUndefined();
  });

  it('전체 결과 수(total)를 넘어가면 더 불러오지 않는다', () => {
    expect(getNextPageStart(2, 20, 41)).toBe(41);
    expect(getNextPageStart(2, 20, 40)).toBeUndefined();
    expect(getNextPageStart(1, 20, 7)).toBeUndefined();
  });
});
