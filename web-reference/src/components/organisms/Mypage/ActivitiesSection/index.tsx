import { useAuthStore } from '../../../../store/useAuthStore';
import ActivityBox from '../../../molecules/user/ActivityBox';

interface ActivitiesSectionProps {
  postCount: number;
  commentCount: number;
  likedCount: number;
}
const ActivitiesSection = ({ postCount, commentCount, likedCount }: ActivitiesSectionProps) => {
  const user = useAuthStore();
  return (
    <div className='flex flex-col gap-2'>
      <p className='text-title03 text-grey-80 md:text-4xl'>나의 활동</p>
      <div className='flex flex-col gap-2 md:gap-4'>
        <ActivityBox
          label={'내가 쓴 게시물'}
          count={postCount}
          link={`/mypage/my-post/${user?.user?.uuid}`}
        />
        <ActivityBox
          label={'내가 쓴 댓글'}
          count={commentCount}
          link={`/mypage/my-comment/${user?.user?.uuid}`}
        />
        <ActivityBox
          label={'찜한 글'}
          count={likedCount}
          link={`/mypage/my-likes/${user?.user?.uuid}`}
        />
      </div>
    </div>
  );
};
export default ActivitiesSection;
