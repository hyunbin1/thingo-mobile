import { useState, useEffect } from 'react';
import Picker from 'react-mobile-picker';
import Drawer from '../Drawer';
import { IoCloseOutline } from 'react-icons/io5';

export interface DatePickerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: Date;
  onChange?: (date: Date) => void;
}

interface PickerValue {
  year: string;
  month: string;
  day: string;
}

export default function DatePickerDrawer({
  open,
  onOpenChange,
  value = new Date(),
  onChange,
}: DatePickerDrawerProps) {
  const [pickerValue, setPickerValue] = useState<PickerValue>({
    year: value.getFullYear().toString(),
    month: (value.getMonth() + 1).toString().padStart(2, '0'),
    day: value.getDate().toString().padStart(2, '0'),
  });

  // value prop이 변경되면 pickerValue 업데이트
  useEffect(() => {
    setPickerValue({
      year: value.getFullYear().toString(),
      month: (value.getMonth() + 1).toString().padStart(2, '0'),
      day: value.getDate().toString().padStart(2, '0'),
    });
  }, [value]);

  // 년도 목록 생성 (현재 년도 기준 ±10년)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => (currentYear - 10 + i).toString());

  // 월 목록 생성 (01~12)
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  // 일 목록 생성 (01~31)
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const handleConfirm = () => {
    if (onChange) {
      const selectedDate = new Date(
        parseInt(pickerValue.year),
        parseInt(pickerValue.month) - 1,
        parseInt(pickerValue.day),
      );
      onChange(selectedDate);
    }
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showHandle={false}>
      <div className='pt-5 pb-4'>
        <div className='flex items-center justify-between px-5'>
          <p className='text-title02 text-black'>날짜 선택</p>
          <button type='button' className='cursor-pointer' onClick={() => onOpenChange(false)}>
            <IoCloseOutline className='text-grey-30 text-2xl' />
          </button>
        </div>

        <Picker value={pickerValue} onChange={setPickerValue} className='text-grey-60 mt-4'>
          <Picker.Column name='year'>
            {years.map((year) => (
              <Picker.Item key={year} value={year}>
                {year}년
              </Picker.Item>
            ))}
          </Picker.Column>
          <Picker.Column name='month'>
            {months.map((month) => (
              <Picker.Item key={month} value={month}>
                {month}월
              </Picker.Item>
            ))}
          </Picker.Column>
          <Picker.Column name='day'>
            {days.map((day) => (
              <Picker.Item key={day} value={day}>
                {day}일
              </Picker.Item>
            ))}
          </Picker.Column>
        </Picker>

        <div className='mt-4 px-5'>
          <button onClick={handleConfirm} className='bg-blue-35 w-full rounded-lg py-3 text-white'>
            선택
          </button>
        </div>
      </div>
    </Drawer>
  );
}
