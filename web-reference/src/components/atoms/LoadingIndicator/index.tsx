import { useEffect, useState } from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

/**
 * Skeleton 사용을 권장합니다.
 * 로딩 인디케이터를 표시합니다. 웹사이트 사용자에게 로딩중인 애니메이션을 표시함으로써 사용자 경험을 개선시킵니다. 로딩 인디케이터는 컴포넌트 마운트 후 0.5초 뒤에 화면에 표시됩니다.
 * @param message 인디케이터 하단에 표시할 메시지를 입력하세요. 입력하지 않을 경우 `불러오는 중...`이 표시됩니다.
 */
const LoadingIndicator = ({ message = '불러오는 중...' }: LoadingIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isVisible)
    return (
      <div className='flex flex-col items-center justify-center h-[150px] font-sans text-sm text-gray-600'>
        <div className='w-10 h-10 border-4 border-[#001f5c4d] border-t-[#001f5c] rounded-full animate-spin mb-2' />
        <p className='text-[navy] font-bold'>{message}</p>
      </div>
    );
  else return <></>;
};

export default LoadingIndicator;
