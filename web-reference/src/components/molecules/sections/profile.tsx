import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Avatar from '../../atoms/Avatar';
import { useAuthStore } from '../../../store/useAuthStore';
import { logout as apiLogout } from '../../../api/user';
import toast from 'react-hot-toast';

interface ProfileSectionProps {
  className?: string;
}

/**
 * 로그인 상태에 따라 사용자 프로필 또는 로그인 유도 UI를 표시
 * - 로그인 상태: 프로필 정보 + 로그아웃 버튼
 * - 비로그인 상태: 로그인/회원가입 버튼
 *
 * 새로 추가된 기능
 * - 로그아웃 시 서버에 /auth/logout 요청(서버가 RT 쿠키 제거)
 * - 프론트의 AT 메모리(store) 초기화, Zustand 세션 상태 초기화
 */
export default function ProfileSection({ className }: ProfileSectionProps) {
  const { isLoggedIn, user, resetUser } = useAuthStore();

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = async () => {
    try {
      // 1) 서버 RT(HttpOnly 쿠키) 폐기
      await apiLogout();

      // 2) 클라이언트 세션 초기화
      resetUser();

      toast.success('로그아웃되었습니다.');
    } catch (e) {
      resetUser();
      console.error('logout error:', e);
      toast.error('로그아웃 처리 중 문제가 발생했습니다.');
    }
  };

  const handleFindId = () => {
    toast.success('아이디는 MSI 아이디와 동일합니다.');
  };

  if (isLoggedIn) {
    return (
      <section
        className={`border-grey-05 flex w-full flex-col rounded-md border p-4 font-sans ${className}`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar src={user?.profileImageUrl} />
            <div className='flex flex-col'>
              <div>
                <span className='font-bold'>{user?.nickname}</span>
              </div>
              <span className='text-sm text-gray-500'>{user?.email}</span>
            </div>
          </div>

          {/* 아이콘을 로그아웃 버튼으로 사용 */}
          <FaExternalLinkAlt
            onClick={handleLogout}
            className='cursor-pointer text-base text-gray-600'
          />
        </div>

        <div className='my-3 h-px w-full bg-gray-300' />

        <div className='flex justify-around text-sm font-bold'>
          <a
            href='https://msi.mju.ac.kr'
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#012968] hover:underline'
          >
            MSI
          </a>
          <a
            href='https://myicap.mju.ac.kr'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:underline'
          >
            <span className='text-[#0386d0]'>MY</span>
            <span className='text-gray-500'>i</span>
            <span className='text-[#002968]'>Cap</span>
          </a>
          <a
            href='https://mcloud.mju.ac.kr'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:underline'
          >
            <span className='text-[#17171b]'>Office</span>
            <span className='text-[#ef6700]'>365</span>
          </a>
          <Link to={`/mypage/${user?.uuid}`} className='text-[#17171b] hover:underline'>
            MyPage
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`border-grey-05 flex flex-col items-center gap-6 rounded-xl border-2 px-6 py-4 ${className}`}
    >
      <div className='flex'>
        <p className='text-body02 text-mju-primary'>로그인</p>
        <p className='text-body03'>하고 MJS를 자유롭게 이용하세요!</p>
      </div>
      <div className='flex w-full flex-col gap-2'>
        <Link
          to='login'
          className='bg-blue-35 hover:bg-blue-15 w-full rounded-xl p-3 text-center transition'
        >
          <p className='text-body02 text-white'>로그인</p>
        </Link>
        <Link
          to='register'
          className='bg-grey-10 hover:bg-grey-20 w-full rounded-xl p-3 text-center transition'
        >
          <p className='text-body02 text-black'>회원가입</p>
        </Link>
      </div>
      <div className='flex w-full'>
        <button className='text-body03 text-grey-40 flex-1 cursor-pointer' onClick={handleFindId}>
          아이디 찾기
        </button>
        <span className='text-body03 text-grey-40'>|</span>
        <Link to='/find-password' className='text-body03 text-grey-40 flex-1 text-center'>
          비밀번호 찾기
        </Link>
      </div>
    </section>
  );
}
