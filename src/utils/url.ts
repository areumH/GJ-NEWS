// 기사 주소에서 출처로 보여줄 도메인을 뽑는다 (Naver API는 언론사 이름을 주지 않는다)
// 예: https://www.busan.com/view/... → busan.com. 주소가 잘못됐으면 빈 문자열
export const getSourceDomain = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};
