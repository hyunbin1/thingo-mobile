import React, { forwardRef } from 'react';
import Input from '../../../atoms/Input/Input';

interface InputFieldProps {
  label: string;
  name?: string;
  placeholder: string;
  type: string;
  autoComplete?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  rightElement?: React.ReactNode;
  showHr?: boolean;
  disabled?: boolean;
  className?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      name,
      placeholder,
      type,
      autoComplete,
      value,
      defaultValue,
      onChange,
      error = false,
      helperText,
      showHr = true,
      rightElement,
      disabled = false,
      className,
    },
    ref,
  ) => {
    return (
      <div className={`mx-auto flex w-full flex-col gap-2 ${className || ''}`}>
        <div className='flex items-center gap-4 md:gap-6'>
          <label className='text-md text-grey-80 text-body04 whitespace-nowrap md:text-xl'>
            {label}
          </label>
          {showHr && (
            <hr
              className={`w-full rounded-xl border-t-2 ${
                disabled ? 'border-grey-40' : 'border-blue-10'
              }`}
            />
          )}
        </div>
        <div className='flex items-center'>
          <Input
            ref={ref}
            type={type}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            placeholder={placeholder}
            variant='outlined'
            error={error}
            helperText={helperText}
            autoComplete={autoComplete}
            disabled={disabled}
          />
          {rightElement && <div className='md:mt-0 md:ml-4'>{rightElement}</div>}
        </div>
      </div>
    );
  },
);

export default InputField;
