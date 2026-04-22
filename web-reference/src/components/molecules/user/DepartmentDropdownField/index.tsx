import DropdownField from '../../common/DropdownField';

interface Props {
  label: string;
  options: Options[];
  department: string;
  setDepartment: (val: string) => void;
  /** 제어 모드: 열림 상태 (다른 드롭다운과 하나만 열리게 할 때 부모에서 전달) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface Options {
  label: string;
  value: string;
}

const DepartmentDropdownField = ({
  label,
  options,
  department,
  setDepartment,
  open,
  onOpenChange,
}: Props) => (
  <DropdownField
    label={label}
    selected={department}
    onSelect={setDepartment}
    options={options}
    placeholder={`${label}를 선택해주세요`}
    open={open}
    onOpenChange={onOpenChange}
  />
);

export default DepartmentDropdownField;
