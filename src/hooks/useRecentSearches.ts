'use client';

import { useSyncExternalStore } from 'react';
import { STORAGE_KEY, KEYWORD_MAX_ITEMS } from '@/constants/news';
import { isStringArray } from '@/utils/validator';
import { createLocalStorageStore } from '@/utils/storage';

const EMPTY: string[] = [];

// 저장값이 없거나 손상됐으면(JSON 아님, 문자열 배열 아님) 빈 목록으로 처리한다
const parseItems = (raw: string | null): string[] => {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isStringArray(parsed) ? parsed.slice(0, KEYWORD_MAX_ITEMS) : EMPTY;
  } catch {
    return EMPTY;
  }
};

const recentSearchStore = createLocalStorageStore(STORAGE_KEY, parseItems);

// 최근 검색어는 localStorage(외부 저장소)에 있으므로 effect 안에서 setState하지 않고 useSyncExternalStore로 구독한다
export const useRecentSearches = () => {
  const items = useSyncExternalStore(
    recentSearchStore.subscribe,
    recentSearchStore.getSnapshot,
    recentSearchStore.getServerSnapshot,
  );

  const addItem = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    const filtered = items.filter((item) => item !== trimmed);
    recentSearchStore.write([trimmed, ...filtered].slice(0, KEYWORD_MAX_ITEMS));
  };

  const removeItem = (keyword: string) => {
    recentSearchStore.write(items.filter((item) => item !== keyword));
  };

  return { items, addItem, removeItem };
};
