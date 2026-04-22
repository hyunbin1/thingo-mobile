import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

export type DividerProps = HTMLAttributes<HTMLHRElement> & {
  variant?: 'default' | 'thin';
};

export default function Divider({ variant = 'default', className, ...props }: DividerProps) {
  return (
    <hr
      {...props}
      className={clsx(
        'w-full rounded-full border-0',
        {
          'from-blue-05 h-[4px] bg-gradient-to-r to-white': variant === 'default',
          'bg-grey-05 h-[2px]': variant === 'thin',
        },
        className,
      )}
    />
  );
}
