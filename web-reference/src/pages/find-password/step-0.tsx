import { useState } from 'react';
import clsx from 'clsx';
import { useSendRecoveryEmail, useVerifyRecoveryCode } from '@/hooks/useFindPw';

interface FindPasswordStep0Props {
  onVerified?: (email: string) => void;
}

export default function FindPasswordStep0({ onVerified }: FindPasswordStep0Props) {
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const { send, loading, done, error } = useSendRecoveryEmail();
  const { verify, loading: verifyLoading, verified, error: verifyError } = useVerifyRecoveryCode();

  return (
    <div className='bg-grey-02 flex flex-1 flex-col'>
      <div className='flex flex-col gap-3 px-5 py-7.5'>
        <span className='text-title01 text-black'>비밀번호 재설정</span>
        <div className='flex flex-col rounded-xl bg-white p-6'>
          {/* 이메일 입력칸 */}
          <span className='text-body04 text-grey-80'>이메일</span>
          <div className='mt-2 flex gap-2'>
            <input
              type='email'
              placeholder='이메일을 입력하세요(@mju.ac.kr)'
              className='border-grey-10 placeholder:text-body06 placeholder:text-grey-20 flex-1 rounded-lg border p-3'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type='button'
              className={clsx(
                'text-body05 w-20 cursor-pointer rounded-xl p-3',
                email.trim() && !loading ? 'bg-mju-primary text-white' : 'bg-grey-20 text-white',
              )}
              disabled={!email.trim() || loading}
              onClick={() => send(email)}
            >
              {loading ? '발송 중...' : '인증요청'}
            </button>
          </div>
          {error && <p className='text-caption02 text-error mt-1'>{error}</p>}
          {done && (
            <p className='text-caption02 text-mju-primary mt-1'>인증 메일을 발송했습니다.</p>
          )}

          {/* 인증번호 입력칸 */}
          <span className='text-body04 text-grey-80 mt-5'>인증번호</span>
          <div className='mt-2 flex gap-2'>
            <input
              type='text'
              placeholder='인증번호를 입력하세요'
              className={clsx(
                'placeholder:text-body06 placeholder:text-grey-20 flex-1 rounded-lg border p-3',
                verifyError ? 'border-error' : 'border-grey-10',
              )}
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
            />
            <button
              type='button'
              className={clsx(
                'text-body05 w-20 cursor-pointer rounded-xl p-3',
                authCode.trim() && !verifyLoading && !verified
                  ? 'bg-mju-primary text-white'
                  : 'bg-grey-20 text-white',
              )}
              disabled={!email.trim() || !authCode.trim() || verifyLoading || verified}
              onClick={() => verify(email, authCode)}
            >
              {verifyLoading ? '확인 중...' : verified ? '인증완료' : '인증확인'}
            </button>
          </div>
          {verifyError && (
            <p className='text-caption02 text-error mt-1'>인증번호가 잘못되었습니다.</p>
          )}

          {/* 다음 버튼 */}
          <button
            type='button'
            className={clsx(
              'text-body05 mt-6 cursor-pointer rounded-lg p-2.5 text-white',
              verified ? 'bg-mju-primary' : 'bg-grey-40',
            )}
            disabled={!verified}
            onClick={() => verified && onVerified?.(email)}
          >
            비밀번호 재설정
          </button>
        </div>
      </div>
    </div>
  );
}
