import { MESSAGE } from '@/constants/messages';

// 감정 분석 실패 상태. "부정 뉴스"(NewsCardNegative)와 구분하되 같은 한 줄 크기로 보여준다
const NewsCardError = () => {
  return (
    <div className="flex w-full items-center px-4 py-3 rounded-xl border border-dashed border-gray-200 bg-white/60 text-sm text-gray-400">
      <p>{MESSAGE.SENTIMENT_ERROR}</p>
    </div>
  );
};

export default NewsCardError;
