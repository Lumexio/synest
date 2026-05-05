import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import * as SystemUI from 'expo-system-ui';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function RootLayout() {
  const theme = useAppTheme();
  const baseTheme = theme.mode === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const paperTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: theme.colors.accent,
      background: theme.colors.background,
      surface: theme.colors.surface,
      onSurface: theme.colors.text,
      onSurfaceVariant: theme.colors.muted,
      outline: theme.colors.border,
    },
  };

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <PaperProvider theme={paperTheme}>
        <StatusBar
          style={theme.mode === 'dark' ? 'light' : 'dark'}
          backgroundColor={theme.colors.background}
        />
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
