interface ChevronDownIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export default function ChevronDownIcon({
  width = 24,
  height = 24,
  className = '',
}: ChevronDownIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M17.999 9L11.999 15L5.99902 9'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
