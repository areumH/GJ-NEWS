export const NEWS_MAX_ITEMS = 1000;

export const STORAGE_KEY = 'recent-searches';
export const KEYWORD_MAX_ITEMS = 10;

// 감정 점수(score, -1 ~ 1)가 이 값 이하면 부정 뉴스로 본다. 그 위(중립 포함)는 모두 긍정으로 표시한다
// 뉴스 점수는 대부분 0 근처에 몰려 있어(실측 120건 중 77%가 -0.25 ~ 0.25), 0을 기준으로 하면
// 날씨·금리 같은 담담한 기사까지 부정으로 가려진다. -0.1은 사고·범죄 기사는 거르고 중립 기사는 남기는 값이다
export const NEGATIVE_SCORE_THRESHOLD = -0.1;
