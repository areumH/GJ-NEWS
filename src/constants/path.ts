export const PATH = {
  HOME: '/',

  SEARCH: (query: string, sort: 'sim' | 'date' = 'sim') =>
    `/search?query=${encodeURIComponent(query)}&sort=${sort}`,
  NEWS: (title: string) => `/news/${encodeURIComponent(title)}`,
};
