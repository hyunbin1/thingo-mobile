import Button from '../../../atoms/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../store/useAuthStore';
import { getDepartmentLabel } from '../../../../utils/department';
import Avatar from '../../../atoms/Avatar';

const ProfileCard = () => {
  const user = useAuthStore((state) => state.user);
  const userDepartmentValue = user?.departmentName || '';
  const departmentLabel = getDepartmentLabel(userDepartmentValue);

  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className='flex flex-col items-center gap-5 rounded-lg bg-white p-6 md:gap-6 md:p-6'>
      <div className='flex w-full items-center gap-4'>
        <Avatar src={user.profileImageUrl} className='h-20 w-20 md:h-40 md:w-40' />
        <div className='flex flex-1 flex-col gap-4'>
          <div className='flex flex-col gap-0.5 p-2 md:gap-1 md:p-4'>
            <p className='text-caption01 break-all text-black md:text-4xl'>{user.nickname}</p>
            <p className='text-caption01 break-all text-black md:text-2xl'>{departmentLabel}</p>
            <p className='text-caption02 break-all text-black md:text-2xl'>{user.studentNumber}</p>
            <p className='text-caption02 text-grey-60 break-all md:text-2xl'>{user.email}</p>
          </div>
        </div>
      </div>
      <div className='hidden w-full md:block'>
        <Button
          variant='blue35'
          size='lg'
          fullWidth
          shape='rounded'
          onClick={() => navigate(`/mypage/${user.uuid}/edit`)}
        >
          프로필 수정
        </Button>
      </div>
      <div className='block w-full md:hidden'>
        <Button
          variant='blue35'
          size='md'
          fontWeight={300}
          disabled={false}
          fullWidth={true}
          shape='rounded'
          onClick={() => navigate(`/mypage/${user.uuid}/edit`)}
        >
          프로필 수정
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
