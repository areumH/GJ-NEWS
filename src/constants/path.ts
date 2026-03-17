export const PATH = {
  HOME: '/',

  SEARCH: (query: string) => `/search?query=${encodeURIComponent(query)}`,
  NEWS: (title: string) => `/news/${encodeURIComponent(title)}`,
};
