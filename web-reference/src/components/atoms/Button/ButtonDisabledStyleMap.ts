import { colors } from '../../../styles/color';

const buttonDisabledStyleMap: Record<string, React.CSSProperties> = {
  main: {
    backgroundColor: colors.grey20,
    color: colors.white,
  },
  sub: {
    backgroundColor: colors.grey20,
    color: colors.grey40,
  },
  basic: {
    backgroundColor: colors.grey20,
    color: colors.grey40,
  },
  blue35: {
    backgroundColor: colors.grey20,
    color: colors.grey40,
  },
  danger: {
    backgroundColor: colors.grey20,
    color: colors.grey40,
  },
  chip: {
    backgroundColor: colors.grey02,
    color: colors.grey40,
  },
  grey: {
    backgroundColor: colors.grey20,
    color: colors.white,
  },
  grey40: {
    backgroundColor: colors.grey40,
    color: colors.white,
  },
  grey20: {
    backgroundColor: colors.grey20,
    color: colors.white,
  },
  greyLight: {
    backgroundColor: colors.grey20,
    color: colors.grey40,
  },
  borderRed: {
    backgroundColor: 'transparent',
    color: colors.error,
    border: `2px solid ${colors.error}`,
  },
};

export default buttonDisabledStyleMap;
