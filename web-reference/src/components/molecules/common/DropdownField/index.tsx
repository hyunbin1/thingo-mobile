import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import clsx from 'clsx';

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  selected: string;
  onSelect: (v: string) => void;
  options: Option[];
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  /** 제어 모드: 지정 시 이 값으로 열림/닫힘 제어 (다른 드롭다운과 하나만 열리게 할 때 사용) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownField = ({
  label,
  selected,
  onSelect,
  options,
  placeholder = '선택하세요',
  error = false,
  errorMessage = '값을 선택해주세요.',
  open: controlledOpen,
  onOpenChange,
}: Props) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setInternalOpen(value);
  };

  const selectedLabel = options.find((item) => item.value === selected)?.label;

  return (
    <div className='relative flex h-[90px] w-full flex-col gap-2'>
      <div className='flex items-center gap-6'>
        <label className='text-grey-80 text-body04 whitespace-nowrap md:text-xl'>{label}</label>
      </div>

      <button
        type='button'
        className='outline-grey-10 flex w-full items-center justify-between rounded-xl bg-white p-3 outline-1 outline-offset-[-2px]'
        onClick={() => setOpen(!open)}
      >
        <span className={clsx('text-sm md:text-base', selected ? 'text-grey-40' : 'text-grey-20')}>
          {selectedLabel || placeholder}
        </span>
        {open ? (
          <IoIosArrowUp className='text-grey-30 text-title01' />
        ) : (
          <IoIosArrowDown className='text-grey-30 text-title01' />
        )}
      </button>

      {open && (
        <ul className='text-grey-40 border-grey-10 absolute top-22 left-0 z-10 mt-1 max-h-48 w-full overflow-auto rounded-xl border-1 bg-white text-sm shadow md:text-base'>
          {options.map((item) => (
            <li
              key={item.value}
              className='hover:bg-grey-10/10 cursor-pointer px-4 py-2'
              onClick={() => {
                onSelect(item.value);
                setOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}

      <p className='mt-2 min-h-[20px] text-xs text-red-500'>{error ? errorMessage : '\u00A0'}</p>
    </div>
  );
};

export default DropdownField;
