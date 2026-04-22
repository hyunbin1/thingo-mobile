import InputField from '../../common/InputField';
import Button from '../../../atoms/Button/Button';
import { EMAIL_DOMAIN } from '@/constants/common';

interface Props {
  id: string;
  setId: (val: string) => void;
  code: string;
  setCode: (val: string) => void;
  isSending: boolean;
  showCodeInput: boolean;
  isVerifying: boolean;
  emailVerified: boolean;
  isEmailChecked: boolean;
  setIsEmailChecked: (val: boolean) => void;
  handleSendCode: () => void;
  handleVerifyCode: () => void;
}

const EmailFieldWithVerification = ({
  id,
  setId,
  code,
  setCode,
  isSending,
  showCodeInput,
  isVerifying,
  emailVerified,
  isEmailChecked,
  setIsEmailChecked,
  handleSendCode,
  handleVerifyCode,
}: Props) => (
  <div className='flex flex-row flex-wrap items-end gap-5'>
    <InputField
      label='이메일'
      type='text'
      autoComplete='email'
      placeholder='이메일을 입력하세요'
      value={id}
      showHr={false}
      onChange={(e) => {
        setId(e.target.value);
        setIsEmailChecked(false);
      }}
      error={false}
      rightElement={
        <div className='flex flex-row items-center gap-2.5 md:gap-6'>
          <p className='text-grey-30 text-body06 ml-2.5 md:order-1'>{EMAIL_DOMAIN}</p>

          <Button
            type='button'
            shape='rounded'
            size='sm'
            disabled={isSending || emailVerified || isEmailChecked || id.trim() === ''}
            onClick={handleSendCode}
            fullWidth={false}
            variant={emailVerified ? 'grey' : isSending ? 'grey' : 'main'}
            className='h-11 w-20 md:order-2 md:mt-0 md:h-12 md:w-34'
          >
            {emailVerified
              ? '완료'
              : isSending
                ? '전송 중...'
                : isEmailChecked
                  ? '전송 완료'
                  : '인증 요청'}
          </Button>
        </div>
      }
    />
    {showCodeInput && (
      <div className='flex w-full items-end gap-4'>
        <InputField
          label=''
          type='text'
          placeholder='인증번호 입력'
          value={code}
          onChange={(e) => setCode(e.target.value.trim())}
          showHr={false}
        />
        <Button
          type='button'
          variant='main'
          disabled={isVerifying || emailVerified || !code.trim()}
          onClick={handleVerifyCode}
          fullWidth={false}
          size='sm'
          shape='rounded'
          className='h-11 w-23 md:mt-0 md:h-12 md:w-34'
        >
          {emailVerified ? '완료' : isVerifying ? '확인 중...' : '인증'}
        </Button>
      </div>
    )}
  </div>
);

export default EmailFieldWithVerification;
