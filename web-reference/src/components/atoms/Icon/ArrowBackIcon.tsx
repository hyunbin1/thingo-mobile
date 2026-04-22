interface ArrowBackIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export default function ArrowBackIcon({
  width = 20,
  height = 20,
  className = '',
}: ArrowBackIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M13 16L7 10L13 4'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
