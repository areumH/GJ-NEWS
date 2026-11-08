import { SpinnerIcon } from '@/components/Icon/SpinnerIcon';

// 헤더는 layout.tsx에 있으므로 결과 영역만 그린다. 여백·스피너는 NewsSearchClient의 로딩 상태와 같다
export default function SearchLoading() {
  return (
    <div className="flex flex-col w-full px-4 sm:px-6">
      <div className="flex w-full justify-center items-center mt-50 sm:mt-40">
        <SpinnerIcon className="w-10 h-10 text-indigo-500 animate-spin" style={{ animationDuration: '1.5s' }} />
      </div>
    </div>
  );
}
