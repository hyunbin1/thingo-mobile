import { useState } from 'react';
import { genderOptions } from '@/constants/gender';
import { useRegisterHandlers } from '@/hooks/useRegister';
import { isValidPassword, validateStudentCode } from '@/utils/validation';
import PersonalInfoSection from './PersonalInfoSection';
import RequiredInfoSection from './RequiredInfoSection';
import ProfileInfoSection from './ProfileInfoSection';
import clsx from 'clsx';

export default function RegisterForm() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [gender, setGender] = useState<string>(genderOptions[0]?.value);

  const {
    code,
    setCode,
    isSending,
    showCodeInput,
    isVerifying,
    emailVerified,
    isEmailChecked,
    isNicknameChecked,
    isStuCodeChecked,
    setIsEmailChecked,
    setIsNicknameChecked,
    handleSendCode,
    handleVerifyCode,
    handleVerifyNickname,
    handleVerifyStudentCode,
    handleSubmit,
  } = useRegisterHandlers({
    id,
    nickname,
    studentCode,
    profileImageFile,
    college,
    pw,
    name,
    gender,
    department,
  });
  const isPwValid = isValidPassword(pw);
  const isPwMatch = pw === confirmPw;
  const confirmError = confirmPw !== '' && !isPwMatch;
  const isStudentCodeValid = validateStudentCode(studentCode);

  const formValid =
    isPwValid &&
    isPwMatch &&
    nickname.trim() &&
    name.trim() &&
    department.trim() &&
    isStudentCodeValid &&
    emailVerified &&
    isEmailChecked &&
    isNicknameChecked &&
    isStuCodeChecked &&
    gender;

  return (
    <form
      className='mt-6 flex w-full flex-col gap-6 md:w-[672px] md:gap-12'
      onSubmit={handleSubmit}
    >
      <RequiredInfoSection
        id={id}
        setId={setId}
        pw={pw}
        setPw={setPw}
        confirmPw={confirmPw}
        setConfirmPw={setConfirmPw}
        code={code}
        setCode={setCode}
        isSending={isSending}
        showCodeInput={showCodeInput}
        isVerifying={isVerifying}
        emailVerified={emailVerified}
        isEmailChecked={isEmailChecked}
        setIsEmailChecked={setIsEmailChecked}
        handleSendCode={handleSendCode}
        handleVerifyCode={handleVerifyCode}
        confirmError={confirmError}
      />
      <PersonalInfoSection
        name={name}
        setName={setName}
        nickname={nickname}
        setNickname={setNickname}
        college={college}
        setCollege={setCollege}
        department={department}
        setDepartment={setDepartment}
        studentCode={studentCode}
        setStudentCode={setStudentCode}
        gender={gender}
        setGender={setGender}
        isSending={isSending}
        isNicknameChecked={isNicknameChecked}
        isStuCodeChecked={isStuCodeChecked}
        isStudentCodeValid={isStudentCodeValid}
        handleVerifyNickname={handleVerifyNickname}
        handleVerifyStudentCode={handleVerifyStudentCode}
        setIsNicknameChecked={setIsNicknameChecked}
      />
      <ProfileInfoSection setProfileImageFile={setProfileImageFile} />
      <button
        type='submit'
        disabled={!formValid}
        className={clsx(
          'text-body05 w-full rounded-lg p-2.5 transition',
          formValid ? 'bg-mju-primary cursor-pointer text-white' : 'bg-grey-40 text-white',
        )}
      >
        Thingo 시작하기
      </button>
    </form>
  );
}
