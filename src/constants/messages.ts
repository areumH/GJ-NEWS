export const PLACE_HOLDER = {
  SEARCH: '어떤 긍정 뉴스를 찾아볼까요?',
};

// 화면에는 보이지 않고 스크린 리더가 읽는 이름 (aria-label)
export const ARIA_LABEL = {
  SEARCH_INPUT: '뉴스 검색어',
  SEARCH_BUTTON: '검색',
  RECENT_SEARCHES: '최근 검색어',
  REMOVE_RECENT_SEARCH: (keyword: string) => `${keyword} 삭제`,
};

export const MESSAGE = {
  REQUEST_ERROR: '요청 처리 중 오류가 발생했습니다.',
  NEGATIVE: '부정 뉴스입니다 !',
  SENTIMENT_ERROR: '감정 분석에 실패했습니다',
};

export const IMAGE_ALTS = {
  LOADING: '로딩 중',
  NEGATIVE: '부정 뉴스',
};

export const SEARCH_RESULT = {
  NONE: '에 대한 검색 결과가 없습니다.',
  CHECK_KEYWORD: '검색어를 다시 확인해주세요!',
};

export const SEARCH_ERROR = {
  TITLE: '뉴스를 불러오지 못했습니다.',
  DESCRIPTION: '잠시 후 다시 시도해주세요.',
  RETRY: '다시 시도',
  HOME: '홈으로 돌아가기',
};

export const FILTER_OPTION = {
  SIM: '정확도순',
  DATE: '최신순',
  TITLE: '제목만',
  POSITIVE: '긍정 뉴스만',
};
