import React from 'react';
import { Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';

type Props = {
  icon?: string;
  size?: number;
  fallbackIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export function AppIcon({
  icon,
  size = 24,
  fallbackIcon = 'application-outline',
}: Props) {
  const theme = useAppTheme();

  if (icon) {
    return (
      <Image
        source={{ uri: `data:image/png;base64,${icon}` }}
        style={{ width: size, height: size, borderRadius: 4 }}
        resizeMode="contain"
      />
    );
  }

  return (
    <MaterialCommunityIcons
      name={fallbackIcon}
      size={size}
      color={theme.colors.muted}
    />
  );
}
