import { MESSAGE } from '@/constants/messages';

// 감정 점수를 기다리는 동안 기사 카드와 같은 모양의 회색 막대(스켈레톤)를 보여준다
const NewsCardLoading = () => {
  return (
    <div className="flex flex-col w-full gap-2.5 animate-pulse" aria-busy>
      <span className="sr-only">{MESSAGE.LOADING}</span>
      <div className="h-3 w-32 rounded bg-gray-200" />
      <div className="h-5 w-4/5 rounded bg-gray-200" />
      <div className="h-4 w-full rounded bg-gray-100" />
      <div className="h-4 w-3/5 rounded bg-gray-100" />
    </div>
  );
};

export default NewsCardLoading;
