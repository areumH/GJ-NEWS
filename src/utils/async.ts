// items 각각에 fn을 실행하되 동시에 최대 limit개까지만 실행한다
// 항목마다 Promise를 따로 돌려주므로, 먼저 끝난 결과부터 쓸 수 있고 일부가 실패해도 나머지에 영향이 없다 (순서는 items와 같음)
export const mapWithLimit = <T, R>(items: readonly T[], limit: number, fn: (item: T) => Promise<R>): Promise<R>[] => {
  let running = 0;
  const waiting: (() => void)[] = [];

  // 빈자리가 있으면 바로 시작, 없으면 앞 작업이 끝날 때까지 줄을 선다
  const acquire = () =>
    running < limit ? (running++, Promise.resolve()) : new Promise<void>((resolve) => waiting.push(resolve));

  // 끝난 자리는 기다리던 작업에 바로 넘긴다 (없으면 자리를 비운다)
  const release = () => {
    const next = waiting.shift();
    if (next) next();
    else running--;
  };

  return items.map(async (item) => {
    await acquire();
    try {
      return await fn(item);
    } finally {
      release();
    }
  });
};
