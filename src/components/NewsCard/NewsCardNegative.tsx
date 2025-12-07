import Image from 'next/image';
import { IMAGE_ALTS, MESSAGE } from '@/constants/messages';

const NewsCardNegative = () => {
  return (
    <div className="flex w-full h-26 justify-center items-center">
      <div className="flex flex-col items-center gap-1.5">
        <div className="relative w-8 h-8 sm:w-11 sm:h-11">
          <Image
            src="/images/devil.png"
            alt={IMAGE_ALTS.NEGATIVE}
            fill
            className="object-contain"
          />
        </div>
        <p className="text-gray-500 sm:text-lg">{MESSAGE.NEGATIVE}</p>
      </div>
    </div>
  );
};

export default NewsCardNegative;
