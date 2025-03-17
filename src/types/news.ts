export interface NewsItem {
  title: string;
  originallink?: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface NewsResponse {
  rss: {
    channel: {
      title: string;
      link: string;
      description: string;
      lastBuildDate: string;
      total: number;
      start: number;
      display: number;
      item: NewsItem[];
    };
  };
}
