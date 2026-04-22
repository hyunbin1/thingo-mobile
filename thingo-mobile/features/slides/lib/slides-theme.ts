import { colors } from '@/constants/colors';

export const slidesTheme = {
  colors: {
    page: '#F5F7F9',
    sectionMuted: colors.grey02,
    footer: '#E8F1FF',
    surface: colors.white,
    surfaceMuted: '#EDF6FF',
    primary: '#1778FF',
    primaryStrong: colors.blue35,
    primarySoft: '#E8F1FF',
    textStrong: colors.black,
    text: '#4B4D4F',
    textMuted: '#909499',
    textSoft: '#AEB2B6',
    textPlaceholder: '#CDD0D4',
    border: colors.grey10,
    borderSoft: colors.grey02,
    hot: '#FF6B2C',
    star: '#FFB800',
    iconBlue: '#8BC7FF',
    chipBorder: '#CDD0D4',
  },
  radius: {
    xl: 20,
    lg: 16,
    md: 12,
    sm: 6,
    pill: 999,
  },
  spacing: {
    pageHorizontal: 16,
    sectionGap: 8,
  },
} as const;
