import { colors } from '../../../styles/color';

const buttonActiveStyleMap: Record<string, React.CSSProperties> = {
  main: {
    backgroundColor: colors.blue35,
    color: colors.white,
  },
  sub: {
    backgroundColor: colors.yellow,
    color: colors.mju_primary,
  },
  basic: {
    backgroundColor: colors.blue15,
    color: colors.white,
  },
  blue20: {
    backgroundColor: colors.blue20,
    color: colors.white,
  },
  blue35: {
    backgroundColor: colors.blue35,
    color: colors.white,
  },
  danger: {
    backgroundColor: colors.error,
    color: colors.white,
  },
  chip: {
    backgroundColor: colors.grey02,
    color: colors.black,
  },
  chipActive: {
    backgroundColor: colors.grey02,
    color: colors.grey40,
  },
  grey: {
    backgroundColor: colors.grey40,
    color: colors.white,
  },
  grey20: {
    backgroundColor: colors.grey20,
    color: colors.white,
  },
  greyLight: {
    backgroundColor: colors.grey10,
    color: colors.grey40,
  },
  greyBlack: {
    backgroundColor: colors.grey10,
    color: colors.black,
  },
  borderRed: {
    backgroundColor: 'transparent',
    color: colors.error,
    border: `2px solid ${colors.error}`,
  },
  borderGrey: {
    backgroundColor: 'transparent',
    color: colors.grey20,
    border: `1px solid ${colors.grey10}`,
  },
};

export default buttonActiveStyleMap;
