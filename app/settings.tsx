import { ScrollView, StyleSheet, Switch, TextInput, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import useGlobalStore from '@/store';
import { accentOptions, backgroundOptions, fontOptions, themePresets } from '@/constants/theme';
import { mockApps } from '@/constants/apps';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { settings, setSettings, toggleHiddenApp, setRenamedApp } = useGlobalStore();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ThemedText type="link" style={{ color: theme.colors.accent }}>
            Back
          </ThemedText>
        </Pressable>
        <ThemedText type="subtitle">Settings</ThemedText>
      </View>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Theme mode
      </ThemedText>
      <View style={styles.row}>
        {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
          <Pressable
            key={mode}
            onPress={() => setSettings({ themeMode: mode })}
            style={[
              styles.chip,
              {
                borderColor: theme.colors.border,
                backgroundColor:
                  settings.themeMode === mode ? theme.colors.surface : 'transparent',
              },
            ]}
          >
            <ThemedText>{mode === 'system' ? 'Auto' : mode}</ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Theme preset
      </ThemedText>
      <View style={styles.row}>
        {(Object.keys(themePresets) as ThemePreset[]).map((preset) => (
          <Pressable
            key={preset}
            onPress={() => setSettings({ themePreset: preset })}
            style={[
              styles.chip,
              {
                borderColor: theme.colors.border,
                backgroundColor:
                  settings.themePreset === preset ? theme.colors.surface : 'transparent',
              },
            ]}
          >
            <ThemedText>{preset}</ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Accent color
      </ThemedText>
      <View style={styles.row}>
        {accentOptions.map((color) => (
          <Pressable
            key={color}
            onPress={() => setSettings({ accentColor: color })}
            style={[
              styles.swatch,
              {
                backgroundColor: color,
                borderColor:
                  settings.accentColor === color ? theme.colors.text : theme.colors.border,
              },
            ]}
          />
        ))}
        <Pressable
          onPress={() => setSettings({ accentColor: null })}
          style={[
            styles.chip,
            { borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
          ]}
        >
          <ThemedText>Default</ThemedText>
        </Pressable>
      </View>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Light background
      </ThemedText>
      <View style={styles.row}>
        {backgroundOptions.light.map((color) => (
          <Pressable
            key={color}
            onPress={() => setSettings({ backgroundLight: color })}
            style={[
              styles.swatch,
              {
                backgroundColor: color,
                borderColor:
                  settings.backgroundLight === color ? theme.colors.text : theme.colors.border,
              },
            ]}
          />
        ))}
        <Pressable
          onPress={() => setSettings({ backgroundLight: null })}
          style={[
            styles.chip,
            { borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
          ]}
        >
          <ThemedText>Default</ThemedText>
        </Pressable>
      </View>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Dark background
      </ThemedText>
      <View style={styles.row}>
        {backgroundOptions.dark.map((color) => (
          <Pressable
            key={color}
            onPress={() => setSettings({ backgroundDark: color })}
            style={[
              styles.swatch,
              {
                backgroundColor: color,
                borderColor:
                  settings.backgroundDark === color ? theme.colors.text : theme.colors.border,
              },
            ]}
          />
        ))}
        <Pressable
          onPress={() => setSettings({ backgroundDark: null })}
          style={[
            styles.chip,
            { borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
          ]}
        >
          <ThemedText>Default</ThemedText>
        </Pressable>
      </View>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Font
      </ThemedText>
      <View style={styles.row}>
        {fontOptions.map((option) => (
          <Pressable
            key={option.key}
            onPress={() => setSettings({ fontFamily: option.key })}
            style={[
              styles.chip,
              {
                borderColor: theme.colors.border,
                backgroundColor:
                  settings.fontFamily === option.key ? theme.colors.surface : 'transparent',
              },
            ]}
          >
            <ThemedText style={{ fontFamily: option.fontFamily }}>
              {option.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Widgets
      </ThemedText>
      {[
        { key: 'showDayProgress', label: 'Day progress' },
        { key: 'showYearProgress', label: 'Year progress' },
        { key: 'showWeather', label: 'Weather' },
        { key: 'showScreenTime', label: 'Screen time' },
        { key: 'showTasks', label: 'Tasks' },
      ].map((item) => (
        <View key={item.key} style={styles.toggleRow}>
          <ThemedText>{item.label}</ThemedText>
          <Switch
            value={settings[item.key as keyof IAppSettings] as boolean}
            onValueChange={(value) => setSettings({ [item.key]: value } as Partial<IAppSettings>)}
          />
        </View>
      ))}

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        App drawer
      </ThemedText>
      <View style={styles.toggleRow}>
        <ThemedText>Show icons</ThemedText>
        <Switch
          value={settings.showIcons}
          onValueChange={(value) => setSettings({ showIcons: value })}
        />
      </View>
      <View style={styles.toggleRow}>
        <ThemedText>Auto focus search</ThemedText>
        <Switch
          value={settings.autoFocusSearch}
          onValueChange={(value) => setSettings({ autoFocusSearch: value })}
        />
      </View>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Hide or rename apps
      </ThemedText>
      {mockApps.map((app) => (
        <View key={app.id} style={styles.appRow}>
          <View style={styles.appInfo}>
            <ThemedText type="defaultSemiBold">{app.name}</ThemedText>
            <TextInput
              value={settings.renamedApps[app.id] ?? ''}
              onChangeText={(text) => setRenamedApp(app.id, text)}
              placeholder="Rename"
              placeholderTextColor={theme.colors.muted}
              style={[
                styles.renameInput,
                { color: theme.colors.text, borderBottomColor: theme.colors.border },
              ]}
            />
          </View>
          <Switch
            value={settings.hiddenApps.includes(app.id)}
            onValueChange={() => toggleHiddenApp(app.id)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  appInfo: {
    flex: 1,
    marginRight: 12,
  },
  renameInput: {
    borderBottomWidth: 1,
    paddingVertical: 4,
    marginTop: 6,
  },
});
