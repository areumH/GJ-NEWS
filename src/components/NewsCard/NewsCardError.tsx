import { MESSAGE } from '@/constants/messages';

// 감정 분석 실패 상태. "부정 뉴스"(NewsCardNegative)와 구분해서 보여준다
const NewsCardError = () => {
  return (
    <div className="flex w-full h-26 justify-center items-center">
      <p className="text-gray-500 sm:text-lg">{MESSAGE.SENTIMENT_ERROR}</p>
    </div>
  );
};

export default NewsCardError;
