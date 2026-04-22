import React from 'react';
import { Link } from 'react-router-dom';
import ActivitiesSection from '../../components/organisms/Mypage/ActivitiesSection';
import ProfileCard from '../../components/molecules/user/ProfileCard';
import LabelButton from '../../components/atoms/Button/LabelButton';
import { useAuthStore } from '../../store/useAuthStore';
import LoginErrorPage from '../LoginError';
import { useProfileStatsQuery } from '@/hooks/queries/useMyPageQueries';

const Mypage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { data: stateData } = useProfileStatsQuery();

  return (
    <div className='bg-grey-02 flex w-full flex-1 flex-col gap-8 p-6 md:p-12'>
      <p className='text-title01 text-black md:text-4xl'>마이페이지</p>
      {user ? (
        <>
          <div className='flex justify-center'>
            <div className='flex w-full max-w-192 flex-col gap-8'>
              <div className='flex flex-col gap-2'>
                <p className='text-title03 text-black md:text-4xl'>프로필</p>
                <ProfileCard />
              </div>
              <ActivitiesSection
                postCount={stateData?.postCount || 0}
                commentCount={stateData?.commentCount || 0}
                likedCount={stateData?.likedPostCount || 0}
              />
              <div className='flex flex-col gap-2'>
                <p className='text-title03 text-grey-80 md:text-4xl'>정보</p>
                <div className='flex min-h-32 flex-col justify-center gap-4 rounded-lg bg-white p-5'>
                  <LabelButton label='커뮤니티 이용 규칙' />
                  <hr className='text-grey-02 border-1' />
                  <LabelButton label='서비스 이용 약관' />
                  <hr className='text-grey-02 border-1' />
                  <LabelButton label='개인정보 처리 방침' />
                </div>
              </div>
              <Link
                to='/mypage/withdraw'
                className='text-body05 text-grey-30 mt-[-12px] flex w-fit cursor-pointer'
              >
                탈퇴하기
              </Link>
            </div>
          </div>
        </>
      ) : (
        <LoginErrorPage />
      )}
    </div>
  );
};

export default Mypage;
