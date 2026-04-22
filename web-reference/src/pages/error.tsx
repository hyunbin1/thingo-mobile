import { Link } from 'react-router-dom';

/**
 * 전역 에러 페이지 (404)
 *
 * 존재하지 않는 경로로 접근했을 때 표시되는 에러 페이지입니다.
 * 홈으로 돌아갈 수 있는 링크를 제공합니다.
 */
export default function GlobalErrorPage() {
  return (
    <div className='w-full h-full flex-1 flex flex-col gap-3 justify-center items-center'>
      <p className='text-title02'>404 Not Found</p>
      <p className='text-title02'>요청하신 페이지를 찾을 수 없습니다</p>
      <Link
        className='w-fit h-fit p-3 rounded-xl flex gap-3 items-center cursor-pointer duration-200 hover:bg-grey-05'
        to={'/'}
      >
        <p className='text-body03 text-blue-10'>홈으로 가기</p>
      </Link>
    </div>
  );
}
