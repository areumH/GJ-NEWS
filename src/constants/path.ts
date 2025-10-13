export const PATH = {
  SEARCH: (query: string) => `/search?query=${encodeURIComponent(query)}`,
  NEWS: (title: string) => `/news/${encodeURIComponent(title)}`,
};
