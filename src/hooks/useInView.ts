'use client';

import { useEffect, useState } from 'react';

interface UseInViewOptions {
  rootMargin?: string;
  // 이 값이 바뀌면 이전 관찰 결과를 버리고 다시 관찰한다 (예: 목록 길이)
  // 목록이 길어진 직후에는 아직 이전 배치 기준의 "보임" 결과가 남아 있어, 이를 그대로 쓰면 한 번 더 불러오게 된다
  observeKey?: unknown;
}

// 요소가 화면(뷰포트 + rootMargin) 안에 있는지 IntersectionObserver로 알려준다
// ref는 콜백 ref라서 요소가 바뀌거나 다시 마운트돼도 새 요소를 관찰한다
export const useInView = <T extends Element>({ rootMargin, observeKey }: UseInViewOptions = {}) => {
  const [node, setNode] = useState<T | null>(null);
  const [observation, setObservation] = useState<{ key: unknown; isIntersecting: boolean } | null>(null);

  useEffect(() => {
    if (!node) return;

    // observe()를 호출하면 현재 배치 기준으로 결과가 한 번 바로 온다 → observeKey가 바뀔 때마다 새 결과를 받는다
    const observer = new IntersectionObserver(
      ([entry]) => setObservation({ key: observeKey, isIntersecting: entry.isIntersecting }),
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, rootMargin, observeKey]);

  // 지금 observeKey로 관찰한 결과만 인정한다
  const inView = observation !== null && observation.key === observeKey && observation.isIntersecting;

  return { ref: setNode, inView };
};
