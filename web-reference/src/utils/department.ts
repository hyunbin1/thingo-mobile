import { DEPARTMENT_OPTIONS } from '../constants/departments';

type DepartmentOption = {
  label: string;
  value: string;
};

const ALL_DEPARTMENT_OPTIONS = DEPARTMENT_OPTIONS.flatMap((option) => option.departments);

export const getDepartmentLabel = (
  value: string,
  options: DepartmentOption[] = ALL_DEPARTMENT_OPTIONS,
): string => {
  const match = options.find((dept) => dept.value === value);
  return match?.label ?? '기타';
};
