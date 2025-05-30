export interface NewsItem {
  title: string;
  originallink?: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface NewsResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NewsItem[];
}
