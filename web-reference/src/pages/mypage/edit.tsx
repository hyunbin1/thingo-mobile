import { useEffect, useState } from 'react';
import RequiredInfo from '../../components/organisms/Edit/RequiredInfo';
import PersonalInfo from '../../components/organisms/Edit/PersonalInfo';
import Button from '../../components/atoms/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { updateMemberInfo } from '../../api/mypage';
import { saveUserInfo, checkNicknameValidation } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { isDuplicateNicknameError } from '../../types/error';
import { handleError } from '../../utils/error';
import LoginErrorPage from '../LoginError';

/**
 * 프로필 수정 페이지
 *
 * 사용자의 필수 정보(비밀번호)와 개인 정보(닉네임, 학과, 학번, 성별)를 수정할 수 있는 페이지입니다.
 */
const Edit: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const navigator = useNavigate();

  // 필수 정보
  const [currentPw, setCurrentPw] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [openForm, setOpenForm] = useState(false);

  // 개인 정보
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [college, setCollege] = useState(user?.college ?? '');
  const [department, setDepartment] = useState(user?.departmentName ?? '');
  const [studentCode, setStudentCode] = useState(user?.studentNumber ?? '');
  const [gender, setGender] = useState(user?.gender ?? '');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isNicknameSending, setIsNicknameSending] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const handleSave = async () => {
    try {
      const profileImageUrl = uploadedImageUrl ?? '';
      if (!user) return;

      await updateMemberInfo({
        name: user.name,
        nickname,
        gender,
        college,
        departmentName: department,
        studentNumber: studentCode,
        profileImageUrl,
      });
      const updatedUserInfo = await saveUserInfo();
      setUser(updatedUserInfo);
      toast.success('회원 정보가 수정되었습니다.');
      navigator(`/mypage/${user?.uuid}`);
    } catch (error) {
      console.error('[오류] 정보 수정 중 오류 발생:', error);
      toast.error('정보 수정 중 오류가 발생했습니다.');
    }
  };

  //닉네임 중복 체크
  const handleVerifyNickname = async () => {
    try {
      setIsNicknameSending(true);
      await checkNicknameValidation(nickname.trim());
      toast.success('사용 가능한 닉네임입니다!');
      setIsNicknameChecked(true);
    } catch (err: unknown) {
      if (isDuplicateNicknameError(err)) {
        toast.error('이미 존재하는 닉네임입니다.');
        setIsNicknameChecked(false);
        return;
      }
      handleError(err, '닉네임 중복 검증에 실패했습니다.');
    } finally {
      setIsNicknameSending(false);
    }
  };

  useEffect(() => {
    if (user) {
      setNickname(user.nickname ?? '');
      setDepartment(user.departmentName ?? '');
      setStudentCode(user.studentNumber ?? '');
      setGender(user.gender ?? '');
    }
  }, [user]);

  return (
    <div className='bg-grey-02 mx-auto flex min-h-screen w-full flex-col items-center justify-center p-6 md:w-[1280px] md:p-12'>
      <p className='text-title01 w-full self-start text-black md:text-4xl'>프로필 수정</p>
      <div className='mt-10 flex w-full flex-col gap-6 md:w-[648px] md:gap-12'>
        {user ? (
          <>
            <div>
              <div className='text-title01 mb-3 flex flex-row'>
                <p className='text-black md:text-4xl'>계정 정보</p>
                <p className='text-error'>*</p>
              </div>
              <RequiredInfo
                currentPw={currentPw}
                setCurrentPw={setCurrentPw}
                pw={pw}
                setPw={setPw}
                confirmPw={confirmPw}
                setConfirmPw={setConfirmPw}
                openForm={openForm}
                setOpenForm={setOpenForm}
              />
            </div>
            <div>
              <div className='text-title01 mb-3 flex flex-row'>
                <p className='text-black md:text-4xl'>기본 정보</p>
                <p className='text-error'>*</p>
              </div>
              <PersonalInfo
                nickname={nickname}
                setNickname={setNickname}
                initialNickname={user?.nickname ?? ''}
                isSending={isNicknameSending}
                isNicknameChecked={isNicknameChecked}
                handleVerifyNickname={handleVerifyNickname}
                setIsNicknameChecked={setIsNicknameChecked}
                college={college}
                setCollege={setCollege}
                department={department}
                setDepartment={setDepartment}
                studentCode={studentCode}
                gender={gender}
                setGender={setGender}
                setUploadedImageUrl={setUploadedImageUrl}
                defaultImg={user?.profileImageUrl ?? ''}
              />
            </div>
            <Button
              variant='blue35'
              shape='rounded'
              size='lg'
              disabled={false}
              fullWidth={true}
              onClick={handleSave}
            >
              저장하기
            </Button>
          </>
        ) : (
          <LoginErrorPage />
        )}
      </div>
    </div>
  );
};

export default Edit;
