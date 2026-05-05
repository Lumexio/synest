import { ScrollView, StyleSheet, Switch, TextInput, View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';
import { RNLauncherKitHelper } from 'react-native-launcher-kit';
import { ThemedText } from '@/components/ThemedText';
import { AppIcon } from '@/components/AppIcon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInstalledApps } from '@/hooks/useInstalledApps';
import useGlobalStore from '@/store';
import { accentOptions, backgroundOptions, fontOptions, themePresets } from '@/constants/theme';
import type { IAppSettings, ThemeMode, ThemePreset } from '@/types';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { settings, setSettings, toggleHiddenApp, setRenamedApp } = useGlobalStore();
  const { apps: installedApps } = useInstalledApps();

  const openAppPermissions = async () => {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert('Error', 'Unable to open app settings.');
    }
  };

  const openAndroidSettings = async () => {
    try {
      RNLauncherKitHelper.goToSettings();
    } catch {
      try {
        await Linking.openSettings();
      } catch {
        Alert.alert('Error', 'Unable to open Android settings.');
      }
    }
  };

  const openDefaultLauncher = async () => {
    try {
      await RNLauncherKitHelper.openSetDefaultLauncher();
    } catch {
      try {
        await Linking.openURL('android.settings.HOME_SETTINGS');
      } catch {
        Alert.alert('Tip', 'Go to Android Settings > Apps > Default apps > Home app to set this launcher as default.');
      }
    }
  };

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

      {/* ── Launcher ── */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Launcher
      </ThemedText>
      <Pressable
        style={[styles.actionButton, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
        onPress={openDefaultLauncher}
      >
        <ThemedText type="defaultSemiBold">Set as default launcher</ThemedText>
      </Pressable>

      {/* ── Permissions ── */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Permissions
      </ThemedText>
      <ThemedText style={[styles.permissionsHint, { color: theme.colors.muted }]}>
        Tap a button to open the relevant Android settings and grant permissions.
      </ThemedText>
      <View style={styles.permissionsRow}>
        <Pressable
          style={[styles.permissionButton, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
          onPress={openAppPermissions}
        >
          <ThemedText type="defaultSemiBold">App permissions</ThemedText>
          <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>Location, Calendar, etc.</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.permissionButton, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
          onPress={openAndroidSettings}
        >
          <ThemedText type="defaultSemiBold">Android Settings</ThemedText>
          <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>All system settings</ThemedText>
        </Pressable>
      </View>

      {/* ── Theme mode ── */}
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

      {/* ── Theme preset ── */}
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

      {/* ── Accent color ── */}
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

      {/* ── Light background ── */}
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

      {/* ── Dark background ── */}
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

      {/* ── Font ── */}
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

      {/* ── Widgets ── */}
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

      {/* ── App drawer ── */}
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

      {/* ── Hide or rename apps ── */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Hide or rename apps
      </ThemedText>
      {installedApps.length === 0 ? (
        <ThemedText style={{ color: theme.colors.muted }}>
          App list unavailable (requires a development build).
        </ThemedText>
      ) : (
        installedApps.map((app) => (
          <View key={app.packageName} style={styles.appRow}>
            <View style={styles.appIconCol}>
              <AppIcon icon={app.icon} size={32} />
            </View>
            <View style={styles.appInfo}>
              <ThemedText type="defaultSemiBold">
                {settings.renamedApps[app.packageName] ?? app.label}
              </ThemedText>
              <TextInput
                value={settings.renamedApps[app.packageName] ?? ''}
                onChangeText={(text) => setRenamedApp(app.packageName, text)}
                placeholder="Rename"
                placeholderTextColor={theme.colors.muted}
                style={[
                  styles.renameInput,
                  { color: theme.colors.text, borderBottomColor: theme.colors.border },
                ]}
              />
            </View>
            <Switch
              value={settings.hiddenApps.includes(app.packageName)}
              onValueChange={() => toggleHiddenApp(app.packageName)}
            />
          </View>
        ))
      )}

      <View style={styles.bottomPadding} />
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
  appIconCol: {
    marginRight: 10,
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
  actionButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  permissionsHint: {
    fontSize: 13,
    marginBottom: 8,
  },
  permissionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  permissionButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  bottomPadding: {
    height: 40,
  },
});
