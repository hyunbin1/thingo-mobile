import InputField from '../../common/InputField';
import { InfoCircleIcon } from '@/components/atoms/Icon';
import { isValidPassword } from '@/utils/validation';

interface Props {
  pw: string;
  setPw: (val: string) => void;
}

export default function PasswordField({ pw, setPw }: Props) {
  const pwValid = !pw || isValidPassword(pw);
  const showError = pw.length > 0 && !pwValid;
  const helperText =
    pw.length > 127
      ? '비밀번호 입력 길이를 초과했습니다.'
      : showError
        ? '비밀번호는 아래 조건을 반드시 충족해야 합니다.'
        : '';

  return (
    <div>
      <InputField
        label='비밀번호'
        type='password'
        autoComplete='new-password'
        placeholder='비밀번호를 입력하세요'
        value={pw}
        showHr={false}
        onChange={(e) => setPw(e.target.value)}
        error={showError}
        helperText={helperText}
      />
      <div className='text-grey-30 text-caption02 mt-2 flex items-center'>
        <InfoCircleIcon />
        <div className='ms-1'>영문, 숫자, 특수문자 포함 8자 이상</div>
      </div>
    </div>
  );
}
