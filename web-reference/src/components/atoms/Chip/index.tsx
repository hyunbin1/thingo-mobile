import clsx from 'clsx';
import { Typography, type TypographyVariant } from '../Typography';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: TypographyVariant;
  selected?: boolean;
}

export default function Chip({
  children,
  variant = 'body03',
  selected = false,
  className,
  ...props
}: ChipProps) {
  return (
    <button
      {...props}
      className={clsx(
        'px-3 py-1 rounded-lg cursor-pointer shrink-0',
        selected ? 'bg-mju-primary text-white' : 'bg-grey-05 hover:bg-blue-05',
        className,
      )}
    >
      <Typography variant={variant}>{children}</Typography>
    </button>
  );
}
