import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { formatToDotDate } from '@/utils/date';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import Avatar from '@/components/atoms/Avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { FiEdit } from 'react-icons/fi';
import { getStudentCouncilNoticeDetail, type StudentCouncilNoticeDetail } from '@/api/departments';
import LoadingIndicator from '@/components/atoms/LoadingIndicator';
import GlobalErrorPage from '@/pages/error';

// 관리자 권한 체크 헬퍼 함수
const hasAdminPermission = (role: string | undefined): boolean => {
  return role === 'OPERATOR' || role === 'ADMIN';
};

export default function DepartmentPostsDetailPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { uuid } = useParams<{ uuid: string }>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [post, setPost] = useState<StudentCouncilNoticeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // API 호출
  useEffect(() => {
    if (!uuid) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const response = await getStudentCouncilNoticeDetail(uuid);
        if (response.data) {
          setPost(response.data);
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error('게시물 조회 실패:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [uuid]);

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <LoadingIndicator />
      </div>
    );
  }

  if (isError || !post) {
    return <GlobalErrorPage />;
  }

  const { authorNickname, publishedAt, imageUrls, content, title } = post;
  const mediaCount = imageUrls.length;

  return (
    <section>
      {/* 헤더: 뒤로가기 + 제목 */}
      <header className='border-grey-10 relative flex h-15 items-center justify-center border-b-1 px-4 py-3'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='absolute left-3 cursor-pointer p-0.5'
          aria-label='뒤로 가기'
        >
          <IoIosArrowBack className='text-2xl text-black' />
        </button>
        <p className='text-body02 text-black'>게시물</p>

        {/* 관리자 권한이 있는 경우 수정 버튼 표시 */}
        {hasAdminPermission(user?.role) && uuid && (
          <Link
            to={`/departments/posts/edit/${uuid}`}
            type='button'
            className='absolute right-4 cursor-pointer p-1'
          >
            <FiEdit className='text-grey-30 text-xl' />
          </Link>
        )}
      </header>

      {/* 작성자 정보 */}
      <div className='flex items-center gap-3 px-5 py-3.5'>
        <Avatar className='h-8 w-8 shrink-0' />
        <span className='text-body06 text-black'>{authorNickname}</span>
      </div>

      {/* 미디어 영역 */}
      <div className='bg-grey-02 relative aspect-[4/5] w-full'>
        <Swiper
          className='h-full w-full'
          slidesPerView={1}
          onSlideChange={(swiper: SwiperClass) => setActiveIndex(swiper.activeIndex)}
          initialSlide={0}
        >
          {imageUrls.map((imageUrl, index) => (
            <SwiperSlide key={index} className='h-full w-full'>
              <img
                src={imageUrl}
                alt={`게시물 미디어 ${index + 1}`}
                className='h-full w-full object-cover'
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {mediaCount > 1 && (
          <span className='text-caption02 bg-grey-40 absolute top-5 right-5 z-10 rounded-lg px-2 py-1 text-white'>
            {activeIndex + 1}
            {' / '}
            {mediaCount}
          </span>
        )}
      </div>
      <div className='p-5'>
        {/* 게시글 제목 */}
        <p className='text-body02 whitespace-pre-wrap text-black'>{title}</p>

        {/* 게시글 내용 */}
        <p className='text-body05 text-grey-80 mt-2 whitespace-pre-wrap'>{content}</p>

        {/* 게시글 날짜 */}
        <p className='text-caption02 text-grey-30 mt-2'>{formatToDotDate(publishedAt)}</p>
      </div>
    </section>
  );
}
