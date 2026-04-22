import NameInputField from '../../molecules/user/NameInputField';
import NicknameFieldWithVerify from '../../molecules/user/NicknameFieldWithVerify';
import DepartmentDropdownField from '../../molecules/user/DepartmentDropdownField';
import StudentCodeFieldWithVerify from '../../molecules/user/StudentCodeFieldWithVerify';
import GenderSelector from '../../molecules/user/GenderSelector';
import { genderOptions } from '../../../constants/gender';
import { DEPARTMENT_OPTIONS, COLLEGE_OPTIONS } from '../../../constants/departments';
import { useEffect, useState } from 'react';

interface Props {
  name: string;
  setName: (val: string) => void;
  nickname: string;
  setNickname: (val: string) => void;
  college: string;
  setCollege: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  studentCode: string;
  setStudentCode: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  isSending: boolean;
  isNicknameChecked: boolean;
  isStuCodeChecked: boolean;
  isStudentCodeValid: boolean;
  handleVerifyNickname: () => void;
  handleVerifyStudentCode: () => void;
  setIsNicknameChecked: (val: boolean) => void;
}

interface Options {
  label: string;
  value: string;
}

const PersonalInfoSection = ({
  name,
  setName,
  nickname,
  setNickname,
  college,
  setCollege,
  department,
  setDepartment,
  studentCode,
  setStudentCode,
  gender,
  setGender,
  isSending,
  isNicknameChecked,
  isStuCodeChecked,
  isStudentCodeValid,
  handleVerifyNickname,
  handleVerifyStudentCode,
  setIsNicknameChecked,
}: Props) => {
  const [departmentOptions, setDepartmentOptions] = useState<Options[]>([]);

  const [openDropdownId, setOpenDropdownId] = useState<'college' | 'department' | null>(null);

  useEffect(() => {
    console.log(college);
    const departmentData = DEPARTMENT_OPTIONS.find((dept) => dept.college.value === college);
    if (departmentData) {
      console.log(departmentData.departments);
      setDepartmentOptions(departmentData.departments);
    }
  }, [college]);

  return (
    <section>
      <div className='text-title01 mb-3 flex w-fit items-center px-1 font-bold'>
        <p className='text-black'>기본 정보</p>
        <p className='text-error'>*</p>
      </div>
      <div className='flex flex-col gap-12 rounded-xl bg-white p-6'>
        <div className='flex w-full flex-col gap-6 md:gap-12'>
          <NameInputField name={name} setName={setName} />
          <NicknameFieldWithVerify
            nickname={nickname}
            setNickname={setNickname}
            isSending={isSending}
            isNicknameChecked={isNicknameChecked}
            handleVerifyNickname={handleVerifyNickname}
            setIsNicknameChecked={setIsNicknameChecked}
          />
          <DepartmentDropdownField
            label='단과대'
            options={COLLEGE_OPTIONS}
            department={college}
            setDepartment={setCollege}
            open={openDropdownId === 'college'}
            onOpenChange={(open) => setOpenDropdownId(open ? 'college' : null)}
          />
          <DepartmentDropdownField
            label='학과'
            options={departmentOptions}
            department={department}
            setDepartment={setDepartment}
            open={openDropdownId === 'department'}
            onOpenChange={(open) => setOpenDropdownId(open ? 'department' : null)}
          />
          <StudentCodeFieldWithVerify
            studentCode={studentCode}
            setStudentCode={setStudentCode}
            isStudentCodeValid={isStudentCodeValid}
            isSending={isSending}
            isStuCodeChecked={isStuCodeChecked}
            handleVerifyStudentCode={handleVerifyStudentCode}
          />
          <GenderSelector
            label='성별'
            options={genderOptions}
            selected={gender}
            onSelect={setGender}
          />
        </div>
      </div>
    </section>
  );
};

export default PersonalInfoSection;
