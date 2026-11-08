import { describe, expect, it } from 'vitest';
import { mapWithLimit } from './async';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('mapWithLimit', () => {
  it('동시에 실행되는 작업이 limit개를 넘지 않는다', async () => {
    let running = 0;
    let peak = 0;

    await Promise.all(
      mapWithLimit(
        Array.from({ length: 12 }, (_, i) => i),
        4,
        async (i) => {
          running++;
          peak = Math.max(peak, running);
          await sleep(5 + (i % 3) * 5);
          running--;
        },
      ),
    );

    expect(peak).toBe(4);
  });

  it('결과 순서는 입력 순서와 같다 (먼저 끝난 순서가 아님)', async () => {
    const results = await Promise.all(
      mapWithLimit([30, 10, 20], 3, async (ms) => {
        await sleep(ms);
        return ms;
      }),
    );

    expect(results).toEqual([30, 10, 20]);
  });

  it('일부가 실패해도 나머지 결과에는 영향이 없다', async () => {
    const settled = await Promise.allSettled(
      mapWithLimit([1, 2, 3, 4], 2, async (n) => {
        if (n === 2) throw new Error('실패');
        return n * 10;
      }),
    );

    expect(settled.map((s) => (s.status === 'fulfilled' ? s.value : 'X'))).toEqual([10, 'X', 30, 40]);
  });

  it('빈 배열이면 빈 배열', () => {
    expect(mapWithLimit([], 5, async () => 1)).toEqual([]);
  });
});
