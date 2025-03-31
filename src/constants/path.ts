export const PATH = {
  SEARCH: (query: string, page: number) =>
    `/search?query=${encodeURIComponent(query)}&page=${page}`,
  NEWS: (title: string) => `/news/${title}`,
};
