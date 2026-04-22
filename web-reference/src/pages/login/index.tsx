import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { login, saveUserInfo } from '@/api/user';
import { useLoginTracking } from '@/hooks/gtm/useLoginTracking';
import { validateMjuEmail } from '@/utils/validation';
import InputField from '@/components/molecules/common/InputField';
import clsx from 'clsx';
import { EMAIL_DOMAIN } from '@/constants/common';
import { toast } from 'react-hot-toast';
import type { AxiosError } from 'axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setLoggedIn, setUser } = useAuthStore();
  const [id, setId] = useState<string>('');
  const [pw, setPw] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);

  const clearErrors = () => {
    setEmailError(false);
  };

  const { markStart, onSubmitCapture, markSuccess } = useLoginTracking({
    method: 'email',
  });

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (id.trim() === '') {
      setEmailError(false);
      return;
    }
    if (pw.trim() === '') {
      return;
    }
    if (!validateMjuEmail(id)) {
      setEmailError(true);
      return;
    }
    onSubmitCapture();

    try {
      await login(id, pw);
      const userInfo = await saveUserInfo();
      setUser(userInfo);
      setLoggedIn(true);

      markSuccess();
      navigate('/');
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'isAxiosError' in err &&
        (err as AxiosError).isAxiosError === true
      ) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
          toast.error('입력하신 정보가 일치하지 않습니다.');
          return;
        }
      }
      toast.error('로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <div className='bg-grey-02 flex flex-1 flex-col'>
      <div className='flex flex-col gap-3 px-5 py-7.5'>
        <p className='text-title01 text-black'>로그인</p>
        <div className='flex flex-col gap-6 rounded-xl bg-white p-6'>
          <form className='flex flex-col' onSubmit={handleLogin} autoComplete='on'>
            <InputField
              ref={inputRef}
              label='이메일'
              name='username'
              type='email'
              placeholder={EMAIL_DOMAIN}
              defaultValue={id}
              showHr={false}
              onChange={(e) => {
                setId(e.target.value);
                clearErrors();
                markStart();
              }}
              error={emailError}
              helperText=''
              autoComplete='username'
            />

            <InputField
              className='mt-5'
              label='비밀번호'
              name='password'
              type='password'
              placeholder='비밀번호를 입력하세요'
              value={pw}
              showHr={false}
              onChange={(e) => {
                setPw(e.target.value);
                clearErrors();
                markStart();
              }}
              autoComplete='current-password'
            />

            <button
              className={clsx(
                'text-body05 mt-7 rounded-xl p-2.5',
                !id.trim() || !pw.trim()
                  ? 'bg-grey-40 text-white'
                  : 'bg-mju-primary cursor-pointer text-white',
              )}
            >
              로그인
            </button>

            <Link
              to='/register'
              className='bg-grey-02 text-body05 text-grey-40 mt-2 w-full rounded-xl p-2.5 text-center'
            >
              회원 가입
            </Link>
          </form>
          <div className='flex items-center'>
            <span className='text-caption02 text-grey-20 flex-1 py-3 text-center'>아이디 찾기</span>
            <span className='text-grey-20 text-caption02'>|</span>
            <Link
              to='/find-password'
              className='text-caption02 text-grey-20 flex-1 py-3 text-center'
            >
              비밀번호 찾기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
