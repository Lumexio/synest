import { useMemo } from 'react';
import { backgroundOptions, fontOptions, themePresets } from '@/constants/theme';
import useGlobalStore from '@/store';
import { useColorScheme } from './useColorScheme';

export function useAppTheme() {
  const settings = useGlobalStore((state) => state.settings);
  const systemScheme = useColorScheme() ?? 'light';
  const resolvedMode = settings.themeMode === 'system' ? systemScheme : settings.themeMode;
  const preset = themePresets[settings.themePreset];

  return useMemo(() => {
    const base = preset[resolvedMode];
    const backgroundOverride =
      resolvedMode === 'light' ? settings.backgroundLight : settings.backgroundDark;
    const colors = {
      ...base,
      accent: settings.accentColor ?? base.accent,
      background: backgroundOverride ?? base.background,
    };
    const fontFamily = fontOptions.find((option) => option.key === settings.fontFamily)
      ?.fontFamily;

    return {
      mode: resolvedMode,
      colors,
      fontFamily,
      backgroundOptions: backgroundOptions[resolvedMode],
    };
  }, [
    preset,
    resolvedMode,
    settings.accentColor,
    settings.backgroundDark,
    settings.backgroundLight,
    settings.fontFamily,
  ]);
}
