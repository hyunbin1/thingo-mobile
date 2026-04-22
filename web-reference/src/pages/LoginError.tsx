import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import { InfoOutlineIcon } from '@/components/atoms/Icon';

/**
 * 로그인 실패 페이지
 *
 * 로그인 실패 시 표시되는 페이지입니다.
 * Thingo 로그인 페이지로 이동하는 링크를 제공합니다.
 */
export default function LoginErrorPage() {
  const navigate = useNavigate();
  return (
    <div className='flex min-h-[calc(100vh-100px)] w-full flex-1 flex-col items-center justify-center gap-10'>
      <div className='flex flex-col items-center gap-3'>
        <InfoOutlineIcon className='text-grey-10' />
        <p className='text-body03 text-grey-30'>로그인 후 이용 가능합니다.</p>
      </div>
      <Button
        variant='main'
        size='md'
        fullWidth={true}
        shape='rounded'
        disabled={false}
        fontWeight='300'
        onClick={() => navigate('/login')}
      >
        Thingo 로그인하기
      </Button>
    </div>
  );
}
