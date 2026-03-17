'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'recent-searches';
const MAX_ITEMS = 10;

export const useRecentSearches = () => {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setItems(JSON.parse(stored));
  }, []);

  const addItem = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setItems((prev) => {
      const filtered = prev.filter((item) => item !== trimmed);
      const next = [trimmed, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (keyword: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item !== keyword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { items, addItem, removeItem };
};
