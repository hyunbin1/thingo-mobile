import InputField from '../../common/InputField';

interface Props {
  confirmPw: string;
  setConfirmPw: (val: string) => void;
  confirmError: boolean;
}

const ConfirmPasswordField = ({ confirmPw, setConfirmPw, confirmError }: Props) => (
  <InputField
    label='비밀번호 확인'
    type='password'
    autoComplete='new-password'
    placeholder='비밀번호를 다시 입력하세요'
    value={confirmPw}
    showHr={false}
    onChange={(e) => setConfirmPw(e.target.value)}
    error={confirmError}
    helperText={confirmError ? '입력한 비밀번호와 일치하지 않습니다.' : ''}
  />
);

export default ConfirmPasswordField;
