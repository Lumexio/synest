/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { ThemeColorName } from '@/constants/theme';
import { useAppTheme } from './useAppTheme';

export function useThemeColor(props: { light?: string; dark?: string }, colorName: ThemeColorName) {
  const theme = useAppTheme();

  const colorFromProps = props[theme.mode];

  if (colorFromProps) {
    return colorFromProps;
  }

  return theme.colors[colorName];
}
