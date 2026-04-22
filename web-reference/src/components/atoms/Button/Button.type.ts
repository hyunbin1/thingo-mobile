export type ButtonVariant =
  | 'main'
  | 'sub'
  | 'basic'
  | 'blue20'
  | 'blue35'
  | 'danger'
  | 'grey'
  | 'grey20'
  | 'grey40'
  | 'greyLight'
  | 'greyBlack'
  | 'borderRed'
  | 'borderGrey'
  | 'chip'
  | 'chipActive';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'pill' | 'rounded';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  disabled?: boolean;
  fullWidth?: boolean;
  fontWeight?: number | string;
}
