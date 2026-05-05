import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';

type ProgressBarProps = {
  label: string;
  progress: number;
};

export function ProgressBar({ label, progress }: ProgressBarProps) {
  const theme = useAppTheme();
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
      <View style={[styles.track, { backgroundColor: theme.colors.border }]}>
        <View
          style={[
            styles.bar,
            {
              width: `${clamped * 100}%`,
              backgroundColor: theme.colors.accent,
            },
          ]}
        />
      </View>
      <ThemedText type="subtitle">{Math.round(clamped * 100)}%</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    gap: 6,
  },
  track: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 999,
  },
});
