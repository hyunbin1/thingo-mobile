import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='bg-white w-[400px] rounded-2xl shadow-lg p-6 relative border-1 border-grey-10'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold'
        >
          x
        </button>

        {title && <h2 className='text-xl font-semibold mb-4'>{title}</h2>}

        <div>{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
