import { describe, expect, it } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
  it('Naver pubDate(RFC 1123, +0900)를 한국 날짜로 표시한다', () => {
    expect(formatDate('Sat, 07 Nov 2026 14:30:00 +0900')).toBe('2026-11-07');
  });

  it('한국 새벽 기사(UTC로는 전날)를 전날로 표시하지 않는다', () => {
    // 한국 11월 7일 01:30 = UTC 11월 6일 16:30
    expect(formatDate('Sat, 07 Nov 2026 01:30:00 +0900')).toBe('2026-11-07');
    expect(formatDate('2026-11-06T16:30:00Z')).toBe('2026-11-07');
  });

  it('한국 자정 직전은 그날로 표시한다', () => {
    expect(formatDate('Fri, 06 Nov 2026 23:59:59 +0900')).toBe('2026-11-06');
  });

  it('잘못된 날짜는 빈 문자열을 돌려준다', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate('날짜 아님')).toBe('');
  });
});
