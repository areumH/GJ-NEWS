import Image from 'next/image';
import { MESSAGE } from '@/constants/messages';

// 부정 뉴스는 기사 대신 한 줄짜리 작은 카드로 접어서, 필터를 켜도 목록이 듬성듬성해 보이지 않게 한다
const NewsCardNegative = () => {
  return (
    <div className="flex w-full items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-gray-200 bg-white/60 text-sm text-gray-400">
      <div className="relative w-5 h-5 shrink-0">
        {/* 장식 이미지: 옆 문구가 같은 뜻을 전하므로 alt를 비워 스크린 리더가 두 번 읽지 않게 한다 */}
        <Image src="/images/devil.png" alt="" fill className="object-contain" />
      </div>
      <p>{MESSAGE.NEGATIVE}</p>
    </div>
  );
};

export default NewsCardNegative;
