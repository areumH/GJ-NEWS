import Image from 'next/image';
import { IMAGE_ALTS } from '@/constants/messages';

const NewsCardLoading = () => {
  return (
    <div className="flex w-full h-26 justify-center items-center">
      <div className="relative w-6 h-6 sm:w-7 sm:h-7">
        <Image
          src="/images/loading.gif"
          alt={IMAGE_ALTS.LOADING}
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default NewsCardLoading;
