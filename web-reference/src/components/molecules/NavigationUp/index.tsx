import { ArrowBackIcon } from '@/components/atoms/Icon';

interface NavigationUpProps {
  onClick: () => void;
}

/**
 * 화살표 표시가 있는 뒤로 가기 버튼입니다.
 * @param onClick 클릭 시 실행할 함수를 입력하세요. 뒤로가기 사용 시 `() => navigate(-1)`를 입력하세요.
 */
export default function NavigationUp({ onClick }: NavigationUpProps) {
  return (
    <button className='flex cursor-pointer items-center py-1' onClick={onClick}>
      <ArrowBackIcon />
      <span className='text-body03 ms-1 text-black'>이전</span>
    </button>
  );
}
