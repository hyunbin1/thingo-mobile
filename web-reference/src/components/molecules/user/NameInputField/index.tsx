import { useMemo } from 'react';
import InputField from '../../common/InputField';

interface Props {
  name: string;
  setName: (val: string) => void;
}

const NameInputField = ({ name, setName }: Props) => {
  const isValidName = useMemo(() => {
    if (!name) return true;

    if (/\d/.test(name)) return false;
    if (name.length > 30) return false;
    if (/[ㄱ-ㅎㅏ-ㅣ]/.test(name)) return false;

    return true;
  }, [name]);

  const showError = name.length > 0 && !isValidName;
  return (
    <div>
      <InputField
        label='이름'
        type='text'
        placeholder='홍길동(실명)'
        value={name}
        showHr={false}
        onChange={(e) => setName(e.target.value)}
        error={showError}
        helperText={showError ? '정확한 이름을 입력해 주세요.' : ''}
      />
      <div className='text-grey-30 text-caption02 mt-2 ml-1 flex flex-col text-[10px]'>
        <p>*실명을 입력하지 않을 경우 추후 불이익이 발생할 수 있습니다.</p>
      </div>
    </div>
  );
};

export default NameInputField;
