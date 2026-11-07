// 서버(UTC)와 브라우저의 결과가 같아야 hydration 불일치가 생기지 않으므로 타임존을 명시한다.
// en-CA 로케일은 YYYY-MM-DD 형식으로 출력된다.
const KST_DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const formatDate = (str: string) => {
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) return '';
  return KST_DATE_FORMATTER.format(date);
};
