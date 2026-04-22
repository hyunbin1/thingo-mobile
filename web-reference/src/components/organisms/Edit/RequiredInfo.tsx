import { useAuthStore } from '../../../store/useAuthStore';
import InputField from '../../molecules/common/InputField';
import Label from '../../atoms/Label';
import Button from '../../atoms/Button';
import { changePassword } from '../../../api/mypage';
import { isValidPassword } from '../../../utils/validation';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { InfoCircleIcon } from '@/components/atoms/Icon';

type RequiredInfoProps = {
  currentPw: string;
  setCurrentPw: (val: string) => void;
  pw: string;
  setPw: (val: string) => void;
  confirmPw: string;
  setConfirmPw: (val: string) => void;
  openForm: boolean;
  setOpenForm: (val: boolean) => void;
};

const RequiredInfo = ({
  currentPw,
  setCurrentPw,
  pw,
  setPw,
  confirmPw,
  setConfirmPw,
  openForm,
  setOpenForm,
}: RequiredInfoProps) => {
  const user = useAuthStore((state) => state.user);
  const isPwMatch = pw === confirmPw;
  const confirmError = confirmPw !== '' && !isPwMatch;
  const pwError = pw !== '' && !isValidPassword(pw);

  const handlePwChange = async () => {
    if (!currentPw || !pw || !confirmPw) {
      toast.error('모든 비밀번호 항목을 입력해주세요.');
      return;
    }
    if (!isValidPassword(pw)) {
      toast.error('비밀번호는 8~127자이며, 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.');
      return;
    }
    if (!isPwMatch) {
      toast.error('[MJS] 새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await changePassword(currentPw, pw);
      toast.success('[MJS] 비밀번호가 변경되었습니다.');
      setOpenForm(false);
      setCurrentPw('');
      setPw('');
      setConfirmPw('');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message ?? '비밀번호 변경에 실패했습니다.';
      toast.error(message);
    }
  };
  return (
    <div
      className={`w-full ${
        openForm ? 'h-[580px]' : 'h-[256px]'
      } flex flex-col items-center justify-center rounded-2xl bg-white p-6`}
    >
      <div className='flex w-full flex-col gap-6'>
        <InputField
          label={'이메일'}
          placeholder={`${user?.email ?? ''}`}
          type={'text'}
          value={user?.email ?? ''}
          showHr={false}
          disabled={true}
          helperText={'*이메일은 수정할 수 없습니다.'}
        />
        <div className='flex flex-col gap-4'>
          {!openForm && <Label lab={'비밀번호 변경'} disabled={false} />}

          {openForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePwChange();
              }}
            >
              <InputField
                label='현재 비밀번호'
                placeholder='현재 비밀번호를 입력하세요'
                type='password'
                value={currentPw}
                showHr={false}
                onChange={(e) => setCurrentPw(e.target.value)}
              />
              <InputField
                className='mt-6'
                label='새 비밀번호'
                placeholder='새 비밀번호를 입력하세요'
                type='password'
                value={pw}
                showHr={false}
                onChange={(e) => setPw(e.target.value)}
              />
              <div
                className={clsx(
                  'text-caption02 mt-2 flex items-center transition',
                  pwError ? 'text-error' : 'text-grey-30',
                )}
              >
                <InfoCircleIcon />
                <p className='ms-1'>
                  {pw.length > 127
                    ? '비밀번호 입력 길이를 초과했습니다'
                    : '영문, 숫자, 특수문자 포함 8자 이상'}
                </p>
              </div>

              <InputField
                className='mt-6'
                label='새 비밀번호 확인'
                type='password'
                autoComplete='new-password'
                placeholder='비밀번호를 다시 입력하세요'
                value={confirmPw}
                showHr={false}
                onChange={(e) => setConfirmPw(e.target.value)}
                error={confirmError}
                helperText={confirmError ? '입력한 비밀번호와 일치하지 않습니다.' : ''}
              />

              <Button
                className='mt-6'
                variant='main'
                type='submit'
                size='md'
                shape='rounded'
                disabled={false}
                fullWidth={true}
                fontWeight={300}
              >
                비밀번호 변경하기
              </Button>
            </form>
          )}
          <Button
            variant='chipActive'
            size='md'
            shape='rounded'
            disabled={false}
            fullWidth={true}
            fontWeight={300}
            onClick={() => setOpenForm(!openForm)}
          >
            {openForm ? '변경 취소' : '비밀번호 변경하기'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequiredInfo;
