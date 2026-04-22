import type { ButtonProps } from './Button.type';
import variantStyleMap from './ButtonActiveStyleMap';
import disabledStyleMap from './ButtonDisabledStyleMap';

const Button = ({
  variant = 'main',
  size = 'md',
  shape = 'pill',
  children,
  disabled = false,
  fullWidth = false,
  fontWeight,

  ...props
}: ButtonProps) => {
  const shapeClassMap = {
    pill: '9999px',
    rounded: '0.75rem',
  } as const;

  const sizeClassMap: Record<string, React.CSSProperties> = {
    sm: { padding: '0.25rem 0.75rem', fontSize: '0.875rem' },
    md: { padding: '0.5rem 1rem', fontSize: '1rem' },
    lg: { padding: '0.75rem 1.25rem', fontSize: '1.125rem' },
  };

  const finalStyle: React.CSSProperties = {
    ...(disabled ? disabledStyleMap[variant] : variantStyleMap[variant]),
    borderRadius: shapeClassMap[shape],
    fontWeight: fontWeight ?? 500,
    transition: 'all 0.2s ease-in-out',
    width: fullWidth ? '100%' : undefined,
    ...sizeClassMap[size],
    cursor: disabled ? '' : 'pointer',
  };

  return (
    <button style={finalStyle} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
