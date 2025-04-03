export interface NewsSearchParams {
  query: string;
  // 검색 키워드
  display: number;
  // 한 번에 표시할 뉴스 항목 수 (기본값: 10, 최댓값: 100)
  start: number;
  // 검색 결과 시작 위치 (기본값: 1, 최댓값: 1000)
  sort: 'sim' | 'date';
  // 'sim' - 정확도 순 정렬
  // 'date' - 날짜 순 정렬
}

export interface FilterState {
  sort: 'sim' | 'date';
  showPositiveOnly: boolean;
  showTitleOnly: boolean;
}
