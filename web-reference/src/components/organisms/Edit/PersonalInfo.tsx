import { useAuthStore } from '../../../store/useAuthStore';
import InputField from '../../molecules/common/InputField';
import DropdownField from '../../molecules/common/DropdownField/index.tsx';
import GenderSelector from '../../molecules/user/GenderSelector';
import ProfileImageUploader from '../../molecules/user/ProfileUploader.tsx';
import { COLLEGE_OPTIONS, DEPARTMENT_OPTIONS } from '../../../constants/departments';

import { uploadProfileImage } from '../../../api/user';
import { genderOptions } from '../../../constants/gender.ts';
import NicknameFieldWithVerify from '@/components/molecules/user/NicknameFieldWithVerify/index.tsx';
import { useEffect, useState } from 'react';

interface Options {
  label: string;
  value: string;
}

type PersonalInfoProps = {
  nickname: string;
  college: string;
  setCollege: (val: string) => void;
  setNickname: (val: string) => void;
  initialNickname: string;
  isSending: boolean;
  isNicknameChecked: boolean;
  handleVerifyNickname: () => void;
  setIsNicknameChecked: (val: boolean) => void;
  department: string;
  setDepartment: (val: string) => void;
  studentCode: string;
  gender: string;
  setGender: (val: string) => void;
  setUploadedImageUrl: (url: string | null) => void;
  defaultImg: string;
};

const PersonalInfo = ({
  nickname,
  college,
  setCollege,
  setNickname,
  initialNickname,
  isSending,
  isNicknameChecked,
  handleVerifyNickname,
  setIsNicknameChecked,
  department,
  setDepartment,
  studentCode,
  gender,
  setGender,
  setUploadedImageUrl,
}: PersonalInfoProps) => {
  const user = useAuthStore((state) => state.user);
  const [departmentOptions, setDepartmentOptions] = useState<Options[]>([]);

  useEffect(() => {
    console.log(college);
    const departmentData = DEPARTMENT_OPTIONS.find((dept) => dept.college.value === college);
    if (departmentData) {
      setDepartmentOptions(departmentData.departments);
    }
  }, [college]);

  return (
    <div className='flex w-full flex-col items-center justify-center rounded-2xl bg-white p-6 md:w-[648px]'>
      <div className='flex w-full flex-col gap-6'>
        <ProfileImageUploader
          defaultImg={user?.profileImageUrl}
          onChange={(file) => {
            const formData = new FormData();
            formData.append('file', file);

            uploadProfileImage(file).then((url) => {
              setUploadedImageUrl(url);
            });
          }}
        />

        <NicknameFieldWithVerify
          nickname={nickname}
          setNickname={setNickname}
          initialNickname={initialNickname}
          isSending={isSending}
          isNicknameChecked={isNicknameChecked}
          handleVerifyNickname={handleVerifyNickname}
          setIsNicknameChecked={setIsNicknameChecked}
        />
        <DropdownField
          label='단과대'
          selected={college}
          onSelect={setCollege}
          options={COLLEGE_OPTIONS}
        />
        <DropdownField
          label='학과'
          selected={department}
          onSelect={setDepartment}
          options={departmentOptions}
        />
        <InputField
          label='학번'
          type='text'
          placeholder={`${user?.studentNumber}`}
          value={studentCode}
          disabled={true}
          helperText={'*학번은 수정할 수 없습니다.'}
          showHr={false}
        />
        <GenderSelector
          label='성별'
          options={genderOptions}
          selected={gender}
          onSelect={setGender}
        />
      </div>
    </div>
  );
};

export default PersonalInfo;
