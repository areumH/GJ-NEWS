'use client';

import { useState, useEffect } from 'react';
import { STORAGE_KEY, KEYWORD_MAX_ITEMS } from '@/constants/news';
import { isStringArray } from '@/utils/validator';

// 저장값이 손상됐거나(JSON 아님, 문자열 배열 아님) localStorage 접근이 막혀 있으면 빈 목록으로 처리한다
const readStoredItems = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return isStringArray(parsed) ? parsed.slice(0, KEYWORD_MAX_ITEMS) : [];
  } catch {
    return [];
  }
};

// 저장 실패(저장소 접근 차단, 저장 공간 초과 등)는 무시한다.
// 이 경우 최근 검색어가 유지되지 않을 뿐 검색 기능은 정상 동작한다
const writeStoredItems = (items: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // 의도적으로 무시
  }
};

export const useRecentSearches = () => {
  const [items, setItems] = useState<string[]>([]);

  // localStorage는 브라우저에만 있으므로 마운트 후에 읽는다 (서버 렌더링 결과와 맞추기 위함)
  useEffect(() => {
    setItems(readStoredItems());
  }, []);

  // 새 목록을 먼저 계산한 뒤 상태 갱신과 저장을 각각 호출한다 (setState 업데이터 안에서 부수 효과를 실행하지 않음)
  const updateItems = (next: string[]) => {
    setItems(next);
    writeStoredItems(next);
  };

  const addItem = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    const filtered = items.filter((item) => item !== trimmed);
    updateItems([trimmed, ...filtered].slice(0, KEYWORD_MAX_ITEMS));
  };

  const removeItem = (keyword: string) => {
    updateItems(items.filter((item) => item !== keyword));
  };

  return { items, addItem, removeItem };
};
