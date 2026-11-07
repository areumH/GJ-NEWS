import { NEWS_SEARCH_PARAMS } from '@/constants/api';
import { SortType } from '@/types/search';

export const isPositive = (score: number) => {
  return score > 0;
};

// URL의 sort처럼 임의 문자열이 올 수 있는 곳에서 사용. 허용값이 아니거나 없으면 기본값
// 클라이언트 컴포넌트(SearchHeader)에서도 쓰므로 zod 없이 작성한다 (zod는 서버 전용, CLAUDE.md 참고)
export const parseSort = (value: unknown): SortType =>
  NEWS_SEARCH_PARAMS.SORTS.find((sort) => sort === value) ?? NEWS_SEARCH_PARAMS.DEFAULT_SORT;

// localStorage 등 외부에서 읽은 값이 문자열 배열인지 확인 (클라이언트용, zod 미사용)
export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');
