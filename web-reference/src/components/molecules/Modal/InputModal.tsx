import React from 'react';
import Button from '../../atoms/Button/Button';
import InputField from '../../atoms/Input/Input';
import Modal from '../common/Modal';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inputValue: string) => void;
  value: string;
  onChange: (val: string) => void;
  title?: string;
  description?: string;
  placeholder?: string;
  confirmLabel?: string;
  error?: boolean;
  helperText?: string;
  type?: 'text' | 'password';
  disabled?: boolean;
}

const InputModal = ({
  isOpen,
  onClose,
  onSubmit,
  value,
  onChange,
  title = '입력',
  description = '',
  placeholder = '',
  confirmLabel = '확인',
  error = false,
  helperText = '',
  type = 'text',
  disabled = false,
}: InputModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <p className='text-sm font-light text-grey-40'>{description}</p>
        <InputField
          variant='field'
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          helperText={error ? helperText : ''}
        />
        <Button type='submit' variant='main' fullWidth shape='rounded' disabled={disabled}>
          {confirmLabel}
        </Button>
      </form>
    </Modal>
  );
};

export default InputModal;
