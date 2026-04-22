import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MapPinProps {
  /** 핀의 크기 및 형태: 'large' (물방울형), 'small' (원형) */
  size?: 'large' | 'small';
  /** 핀의 내용 타입: 'number' (숫자), 'icon' (아이콘), 'default' (빈 원/모양) */
  variant?: 'number' | 'icon' | 'default';
  /** 노출할 숫자나 텍스트 */
  value?: string | number;
  /** 추가 스타일 클래스 */
  className?: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

/**
 * 지도 위에 노출되는 핀 컴포넌트 (4가지 스타일 지원)
 */
export const MapPin = ({
  size = 'large',
  variant = 'default',
  value,
  className,
  onClick,
}: MapPinProps) => {
  if (size === 'large') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'relative flex h-[50px] w-[37px] items-start justify-center transition-transform active:scale-95',
          className,
        )}
      >
        {/* 배경 핀 */}
        <img
          src={variant === 'number' ? '/assets/location-num.svg' : '/assets/location-dot.svg'}
          alt=''
          className='absolute inset-0 h-full w-full'
        />

        {/* 숫자 노출 영역 (건물 번호일 때만) */}
        {variant === 'number' && (
          <span className='z-10 mt-[7px] flex h-5 w-full items-center justify-center text-[14px] font-semibold text-white'>
            {value}
          </span>
        )}
      </button>
    );
  }

  // Small (원형) 타입
  return (
    <button
      onClick={onClick}
      className={cn(
        'bg-blue-35 flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-transform active:scale-95',
        className,
      )}
    >
      {variant === 'number' && (
        <span className='text-[11px] leading-none font-semibold text-white'>{value}</span>
      )}
      {variant === 'icon' && <img src='/assets/sign-icon.svg' alt='출입구' className='h-4 w-4' />}
    </button>
  );
};
