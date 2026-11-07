// Naver 검색 응답의 title·description은 HTML 조각이다
// - 검색어 강조: <b>날씨</b>
// - 기사 원문의 특수문자는 엔티티로 온다: &quot; &lt; &gt; &amp; ...
// 이 문자열을 HTML로 주입하지 않고, 텍스트와 강조 여부로 나눠 React가 텍스트로만 렌더링하게 한다

export interface TextSegment {
  text: string;
  highlighted: boolean;
}

const NAMED_ENTITIES: Record<string, string> = {
  quot: '"',
  amp: '&',
  lt: '<',
  gt: '>',
  apos: "'",
  nbsp: ' ',
};

// 엔티티를 문자로 바꾼다 (이름 엔티티 + &#39; 같은 10진수, &#x27; 같은 16진수)
// 한 번에 치환하므로 "&amp;lt;"는 "&lt;"가 될 뿐 "<"까지 풀리지 않는다
// 모르는 엔티티는 원문 그대로 둔다
export const decodeEntities = (text: string): string =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code.startsWith('#')) {
      const isHex = code[1] === 'x' || code[1] === 'X';
      const codePoint = isHex ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });

// 태그를 지운다. 태그 모양(<영문자 또는 </영문자)만 대상으로 해서 "3 < 5" 같은 글자는 남긴다
const removeTags = (text: string): string => text.replace(/<\/?[a-z][^>]*>/gi, '');

// 태그를 먼저 지우고 엔티티는 마지막에 푼다
// (순서가 반대면 기사 속 "&lt;b&gt;"라는 글자가 진짜 <b> 태그로 바뀐다)
export const stripHtml = (text: string): string => decodeEntities(removeTags(text));

// <b> 구간은 강조로 표시하고, 그 외 태그는 지운 텍스트 조각 목록을 만든다
export const parseHighlight = (text: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  let highlighted = false;

  // 캡처 그룹으로 나누면 구분자(<b>, </b>)도 배열에 남는다
  for (const part of text.split(/(<\/?b>)/i)) {
    if (/^<b>$/i.test(part)) {
      highlighted = true;
    } else if (/^<\/b>$/i.test(part)) {
      highlighted = false;
    } else {
      const clean = stripHtml(part);
      if (clean) segments.push({ text: clean, highlighted });
    }
  }

  return segments;
};
