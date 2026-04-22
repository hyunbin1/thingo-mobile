import InputField from '../../common/InputField';
import Button from '../../../atoms/Button/Button';

interface Props {
  studentCode: string;
  setStudentCode: (val: string) => void;
  isStudentCodeValid: boolean;
  isSending: boolean;
  isStuCodeChecked: boolean;
  handleVerifyStudentCode: () => void;
}

const StudentCodeFieldWithVerify = ({
  studentCode,
  setStudentCode,
  isStudentCodeValid,
  isSending,
  isStuCodeChecked,
  handleVerifyStudentCode,
}: Props) => (
  <div>
    <InputField
      label='학번'
      type='text'
      placeholder='ex.60000000'
      value={studentCode}
      onChange={(e) => setStudentCode(e.target.value)}
      error={studentCode !== '' && !isStudentCodeValid}
      showHr={false}
      helperText={studentCode && !isStudentCodeValid ? '학번 형식이 올바르지 않습니다.' : ''}
      rightElement={
        <Button
          type='button'
          shape='rounded'
          size='sm'
          disabled={isSending || !isStudentCodeValid || isStuCodeChecked}
          onClick={handleVerifyStudentCode}
          fullWidth={false}
          variant={
            !studentCode ? 'grey20' : isSending ? 'grey20' : isStuCodeChecked ? 'grey20' : 'main'
          }
          className='ml-4 h-11 w-20 md:h-12 md:w-34'
        >
          {!studentCode
            ? '중복 확인'
            : isSending
              ? '확인 중...'
              : isStuCodeChecked
                ? '확인 완료'
                : '중복 확인'}
        </Button>
      }
    />
  </div>
);

export default StudentCodeFieldWithVerify;
