export const HTTP_STATUS_CODE = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SYSTEM_ERROR: 500,
} as const;

export const END_POINT = {
  NEWS_SEARCH: (encodedQuery: string, display: number, start: number, sort: string) =>
    `naver-api/v1/search/news.json?query=${encodedQuery}&display=${display}&start=${start}&sort=${sort}`,
};

export const AXIOS = {
  TIMEOUT: 7000,
};
