import { describe, expect, it } from 'vitest';
import { decodeEntities, parseHighlight, stripHtml } from './html';

// dangerouslySetInnerHTML을 대신하는 보안 관련 코드 (Task 3-2)
// Naver 응답 문자열을 텍스트 조각으로만 바꾸고, 태그가 실행되거나 다시 만들어지지 않는지 확인한다

describe('parseHighlight', () => {
  it('<b> 구간을 강조 조각으로 나누고 엔티티를 문자로 바꾼다', () => {
    expect(parseHighlight('오늘 <b>날씨</b>는 &quot;맑음&quot;')).toEqual([
      { text: '오늘 ', highlighted: false },
      { text: '날씨', highlighted: true },
      { text: '는 "맑음"', highlighted: false },
    ]);
  });

  it('<b>가 아닌 태그(img, script 등)는 지우고 글자만 남긴다', () => {
    expect(parseHighlight('<img src=x onerror="alert(1)"><b>날씨</b><script>alert(2)</script>끝')).toEqual([
      { text: '날씨', highlighted: true },
      { text: 'alert(2)끝', highlighted: false },
    ]);
  });

  it('이중 인코딩된 &amp;lt;b&amp;gt;는 태그로 풀리지 않고 글자로 남는다', () => {
    expect(parseHighlight('&amp;lt;b&amp;gt; 그리고 &lt;b&gt;가짜&lt;/b&gt;')).toEqual([
      { text: '&lt;b&gt; 그리고 <b>가짜</b>', highlighted: false },
    ]);
  });

  it('태그가 아닌 부등호(3 < 5)는 지우지 않는다', () => {
    expect(parseHighlight('3 < 5 그리고 7 > 2')).toEqual([{ text: '3 < 5 그리고 7 > 2', highlighted: false }]);
  });

  it('대문자 <B>도 강조로 처리한다', () => {
    expect(parseHighlight('<B>대문자</B> 일반')).toEqual([
      { text: '대문자', highlighted: true },
      { text: ' 일반', highlighted: false },
    ]);
  });

  it('빈 문자열이면 빈 배열', () => {
    expect(parseHighlight('')).toEqual([]);
  });
});

describe('decodeEntities', () => {
  it('10진수·16진수 엔티티를 문자로 바꾸고, 모르는 엔티티와 0번 코드는 그대로 둔다', () => {
    expect(decodeEntities('&#39;a&#x27; &#128512; &unknown; &#0;')).toBe("'a' 😀 &unknown; &#0;");
  });
});

describe('stripHtml (감정 분석에 보낼 문장)', () => {
  it('태그를 지우고 엔티티를 푼 순수 문장을 만든다', () => {
    expect(stripHtml('<b>날씨</b> 소식 &quot;춥다&quot; &lt;속보&gt;')).toBe('날씨 소식 "춥다" <속보>');
  });
});
