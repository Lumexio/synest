import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import BottomSheetModal from '@/components/BottomSheet';
import List from '@/components/ListTask';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ProgressBar } from '@/components/ProgressBar';
import useGlobalStore from '@/store';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { settings, tasks } = useGlobalStore((state) => ({
    settings: state.settings,
    tasks: state.tasks,
  }));
  const [isModalOpen, setModalOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleFabPress = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const { dayProgress, yearProgress } = useMemo(() => {
    const minutes = now.getHours() * 60 + now.getMinutes();
    const dayProgressValue = minutes / (24 * 60);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1);
    const yearProgressValue =
      (now.getTime() - startOfYear.getTime()) /
      (startOfNextYear.getTime() - startOfYear.getTime());

    return {
      dayProgress: dayProgressValue,
      yearProgress: yearProgressValue,
    };
  }, [now]);

  const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateLabel = now.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const swipeLeft = Gesture.Pan()
    .activeOffsetX([-9999, -20])
    .failOffsetY([-15, 15])
    .onEnd((event) => {
      if (event.translationX < -60) {
        runOnJS(router.push)('/drawer');
      }
    });

  const swipeUp = Gesture.Pan()
    .activeOffsetY([-9999, -20])
    .failOffsetX([-15, 15])
    .onEnd((event) => {
      if (event.translationY < -80) {
        runOnJS(router.push)('/drawer');
      }
    });

  const combinedGesture = Gesture.Race(swipeLeft, swipeUp);

  return (
    <GestureDetector gesture={combinedGesture}>
      <Pressable
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        onLongPress={() => router.push('/settings')}
        delayLongPress={600}
      >
        <View style={styles.header}>
          <View>
            <ThemedText type="title">{timeLabel}</ThemedText>
            <ThemedText type="subtitle">{dateLabel}</ThemedText>
          </View>
          <Pressable onPress={() => router.push('/settings')}>
            <ThemedText type="link" style={{ color: theme.colors.accent }}>
              Settings
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.widgets}>
          {settings.showDayProgress && (
            <ProgressBar label="Day progress" progress={dayProgress} />
          )}
          {settings.showYearProgress && (
            <ProgressBar label="Year progress" progress={yearProgress} />
          )}
          {settings.showScreenTime && (
            <Pressable onPress={() => router.push('/settings')}>
              <ThemedText style={{ color: theme.colors.muted }}>
                Screen time: enable Digital Wellbeing permissions
              </ThemedText>
            </Pressable>
          )}
          {settings.showWeather && (
            <Pressable onPress={() => router.push('/settings')}>
              <ThemedText style={{ color: theme.colors.muted }}>
                Weather: add a location in Settings
              </ThemedText>
            </Pressable>
          )}
        </View>

        {settings.showTasks && (
          <View style={styles.tasksSection}>
            <ThemedText type="subtitle">Tasks</ThemedText>
            <List />
            {tasks.length === 0 && (
              <ThemedText style={{ color: theme.colors.muted }}>
                No tasks yet. Tap + to add one.
              </ThemedText>
            )}
          </View>
        )}

        <Pressable style={styles.drawerLink} onPress={() => router.push('/drawer')}>
          <ThemedText type="defaultSemiBold" style={{ color: theme.colors.accent }}>
            All Apps ›
          </ThemedText>
        </Pressable>

        <FAB
          style={[styles.fab, { backgroundColor: theme.colors.accent }]}
          icon="plus"
          onPress={handleFabPress}
          color={theme.mode === 'dark' ? '#000' : '#fff'}
        />
        <BottomSheetModal
          editCreateFlag=""
          taskData={{ title: '', description: '', id: '', completed: false }}
          open={isModalOpen}
          onClose={closeModal}
        />
      </Pressable>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  widgets: {
    gap: 12,
    marginBottom: 24,
  },
  tasksSection: {
    flex: 1,
    marginBottom: 16,
  },
  drawerLink: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
