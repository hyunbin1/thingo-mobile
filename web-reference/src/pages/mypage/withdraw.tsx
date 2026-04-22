import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { deleteUser } from '../../api/user';
import { handleError } from '../../utils/error';
import toast from 'react-hot-toast';
import LoginErrorPage from '../LoginError';
import InputField from '../../components/molecules/common/InputField';

/**
 * 회원 탈퇴 전용 페이지
 * 비밀번호 확인 후 탈퇴 처리하며, 탈퇴 시 복구 불가 안내를 제공합니다.
 */
const WithdrawPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [passwordRequiredError, setPasswordRequiredError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!password.trim()) {
      setPasswordRequiredError(true);
      return;
    }

    setIsSubmitting(true);
    setHasError(false);
    setPasswordRequiredError(false);
    try {
      const status = await deleteUser(password);
      // 명세: 성공 시 204 No Content
      if (status === 204 || status === 200) {
        toast.success('회원 탈퇴가 완료되었습니다.');
        localStorage.removeItem('accessToken');
        window.location.href = '/';
      }
    } catch (error) {
      handleError(error, '회원 탈퇴 처리 중 오류가 발생했습니다.', { showToast: false });
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/mypage');
  };

  if (!user) {
    return <LoginErrorPage />;
  }

  return (
    <div className='bg-grey-02 flex w-full flex-1 flex-col gap-8 p-6 md:p-12'>
      <div className='mx-auto flex w-full max-w-192 flex-col gap-8'>
        <div className='flex flex-col gap-2'>
          <p className='text-title01 text-black md:text-4xl'>회원 탈퇴</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6 rounded-lg bg-white p-6'>
          <p className='text-body05 text-grey-60'>
            탈퇴 시 모든 회원 정보가 삭제되며 복구할 수 없습니다. 정말 탈퇴하시겠습니까?
          </p>
          <InputField
            label='비밀번호'
            type='password'
            placeholder='비밀번호를 입력하세요'
            showHr={false}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (hasError) setHasError(false);
              if (passwordRequiredError) setPasswordRequiredError(false);
            }}
            error={hasError || passwordRequiredError}
            helperText={
              passwordRequiredError
                ? '비밀번호를 입력해주세요.'
                : hasError
                  ? '비밀번호가 일치하지 않습니다.'
                  : undefined
            }
            autoComplete='current-password'
            disabled={isSubmitting}
          />

          <div>
            <button
              type='button'
              onClick={handleCancel}
              disabled={isSubmitting}
              className='bg-blue-35 text-body05 h-10 w-full cursor-pointer rounded-lg text-white'
            >
              취소
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='bg-grey-20 text-body05 mt-3 h-10 w-full cursor-pointer rounded-lg text-white'
            >
              {isSubmitting ? '처리 중...' : '탈퇴하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawPage;
