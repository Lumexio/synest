import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { mockApps } from '@/constants/apps';
import useGlobalStore from '@/store';

export default function AppDrawerScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const searchRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const settings = useGlobalStore((state) => state.settings);

  useEffect(() => {
    if (settings.autoFocusSearch) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [settings.autoFocusSearch]);

  const apps = useMemo(() => {
    return mockApps
      .filter((app) => !settings.hiddenApps.includes(app.id))
      .map((app) => ({
        ...app,
        displayName: settings.renamedApps[app.id] ?? app.name,
      }))
      .filter((app) => app.displayName.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [query, settings.hiddenApps, settings.renamedApps]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ThemedText type="link" style={{ color: theme.colors.accent }}>
            Home
          </ThemedText>
        </Pressable>
        <ThemedText type="subtitle">All Apps</ThemedText>
        <Pressable onPress={() => router.push('/settings')}>
          <ThemedText type="link" style={{ color: theme.colors.accent }}>
            Settings
          </ThemedText>
        </Pressable>
      </View>

      <View
        style={[
          styles.searchContainer,
          { borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
        ]}
      >
        <TextInput
          ref={searchRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Search apps"
          placeholderTextColor={theme.colors.muted}
          style={[styles.searchInput, { color: theme.colors.text }]}
        />
      </View>

      <FlashList
        data={apps}
        estimatedItemSize={56}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {settings.showIcons && (
              <MaterialCommunityIcons
                name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                size={20}
                color={theme.colors.muted}
                style={styles.icon}
              />
            )}
            <ThemedText type="defaultSemiBold">{item.displayName}</ThemedText>
          </View>
        )}
        ListEmptyComponent={
          <ThemedText style={{ color: theme.colors.muted }}>
            No matches. Try a different search.
          </ThemedText>
        }
      />
    </View>
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
  searchContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
});
