import Layout from '@/pages/layout';
import BoardDetail from '@/pages/board/detail';
import BoardEdit from '@/pages/board/edit';
import BoardWrite from '@/pages/board/write';
import GlobalErrorPage from '@/pages/error';
import DepartmentPostsDetailPage from '@/pages/departments/posts/detail';
import DepartmentPostsNewPage from '@/pages/departments/posts/new';
import DepartmentEventsNewPage from '@/pages/departments/events/new';
import DepartmentEventsEditPage from '@/pages/departments/events/edit';
import DepartmentPostsEditPage from '@/pages/departments/posts/edit';
import LoginPage from '@/pages/login';
import MyPage from '@/pages/mypage';
import MyPageEdit from '@/pages/mypage/edit';
import MyPageWithdraw from '@/pages/mypage/withdraw';
import ViewComments from '@/pages/mypage/viewComments';
import ViewLikes from '@/pages/mypage/viewLikes';
import ViewPosts from '@/pages/mypage/viewPosts';
import Register from '@/pages/register';
import { AgentationTool } from '@/utils/agentation';
import type { Location } from 'react-router-dom';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomeSlider from '@/pages/HomeSlider';
import SearchOverlay from '@/pages/search/SearchOverlay';
import FindPasswordPage from '@/pages/find-password';
import SearchDetailOverlay from './pages/search/SearchDetailOverlay';

export default function App() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | undefined;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route element={<Layout />}>
          <Route path='/' element={<HomeSlider />} />

          {/* 게시판 */}
          <Route path='/board/:uuid' element={<BoardDetail />} />
          <Route path='/board/write' element={<BoardWrite />} />
          <Route path='/board/edit/:uuid' element={<BoardEdit />} />

          {/* 마이페이지 */}
          <Route path='/mypage' element={<MyPage />} />
          <Route path='/mypage/:uuid' element={<MyPage />} />
          <Route path='/mypage/:uuid/edit' element={<MyPageEdit />} />
          <Route path='/mypage/withdraw' element={<MyPageWithdraw />} />
          <Route path='/mypage/my-post/:uuid' element={<ViewPosts />} />
          <Route path='/mypage/my-comment/:uuid' element={<ViewComments />} />
          <Route path='/mypage/my-likes/:uuid' element={<ViewLikes />} />

          {/* 검색 */}
          <Route path='/search' element={<SearchDetailOverlay />} />

          {/* 에러 페이지 */}
          <Route path='*' element={<GlobalErrorPage />} />

          {/* 학과별 정보 */}
          <Route path='/departments/posts/:uuid' element={<DepartmentPostsDetailPage />} />
          <Route path='/departments/posts/new' element={<DepartmentPostsNewPage />} />
          <Route path='/departments/posts/edit/:uuid' element={<DepartmentPostsEditPage />} />
          <Route path='/departments/events/new' element={<DepartmentEventsNewPage />} />
          <Route path='/departments/events/edit/:uuid' element={<DepartmentEventsEditPage />} />

          {/* 로그인 */}
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<Register />} />
          <Route path='/find-password' element={<FindPasswordPage />} />
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path='/search' element={<SearchOverlay />} />
        </Routes>
      )}

      <AgentationTool />
    </>
  );
}
