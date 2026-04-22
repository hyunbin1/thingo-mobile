import type { ReactNode } from 'react';

interface SectionSlideProps {
  title: string;
  children: ReactNode;
  backgroundColor?: string;
}

export default function SectionSlide({
  title,
  children,
  backgroundColor = 'bg-blue-05',
}: SectionSlideProps) {
  return (
    <div className={`flex h-full w-full flex-col ${backgroundColor}`}>
      <div className='bg-blue-35 px-6 py-4 shadow-sm'>
        <h2 className='text-title01 text-white'>{title}</h2>
      </div>

      <div className='flex-1 overflow-y-auto px-4 py-6'>{children}</div>
    </div>
  );
}
