import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type GestureResponderEvent,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Button, Dialog, Menu, Portal } from 'react-native-paper';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { RNLauncherKitHelper } from 'react-native-launcher-kit';
import { ThemedText } from '@/components/ThemedText';
import { AppIcon } from '@/components/AppIcon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useInstalledApps } from '@/hooks/useInstalledApps';
import useGlobalStore from '@/store';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const estimatedRowHeight = 52;

type DrawerApp = {
  packageName: string;
  label: string;
  icon: string;
  displayName: string;
  isFavorite: boolean;
};

export default function AppDrawerScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const searchRef = useRef<TextInput>(null);
  const listRef = useRef<FlashList<DrawerApp>>(null);
  const indexRef = useRef<View>(null);
  const [query, setQuery] = useState('');
  const [indexLayout, setIndexLayout] = useState({ top: 0, height: 0 });
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [selectedApp, setSelectedApp] = useState<DrawerApp | null>(null);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const { settings, toggleHiddenApp, toggleFavoriteApp, setRenamedApp } = useGlobalStore();

  const { apps: installedApps, loading } = useInstalledApps();

  useEffect(() => {
    if (settings.autoFocusSearch) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [settings.autoFocusSearch]);

  const apps = useMemo<DrawerApp[]>(() => {
    return installedApps
      .filter((app) => !settings.hiddenApps.includes(app.packageName))
      .map((app) => ({
        packageName: app.packageName,
        label: app.label,
        icon: app.icon,
        displayName: settings.renamedApps[app.packageName] ?? app.label,
        isFavorite: settings.favoriteApps.includes(app.packageName),
      }))
      .filter((app) =>
        app.displayName.toLowerCase().includes(query.trim().toLowerCase())
      )
      .sort((a, b) => {
        if (a.isFavorite !== b.isFavorite) {
          return a.isFavorite ? -1 : 1;
        }
        return a.displayName.localeCompare(b.displayName);
      });
  }, [
    installedApps,
    query,
    settings.hiddenApps,
    settings.renamedApps,
    settings.favoriteApps,
  ]);

  const letterIndex = useMemo(() => {
    const map = new Map<string, number>();
    apps.forEach((app, index) => {
      const firstChar = app.displayName.charAt(0).toUpperCase();
      const normalized = alphabet.includes(firstChar) ? firstChar : '#';
      if (!map.has(normalized)) {
        map.set(normalized, index);
      }
    });
    return map;
  }, [apps]);

  const handleOpenApp = (app: DrawerApp) => {
    try {
      RNLauncherKitHelper.launchApplication(app.packageName);
    } catch {
      Alert.alert('Error', 'Failed to open the app.');
    }
  };

  const handleLongPress = (event: GestureResponderEvent, app: DrawerApp) => {
    setSelectedApp(app);
    setMenuAnchor({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY });
    setMenuVisible(true);
  };

  const handleHideApp = () => {
    if (selectedApp) {
      toggleHiddenApp(selectedApp.packageName);
    }
    setMenuVisible(false);
  };

  const handleToggleFavorite = () => {
    if (selectedApp) {
      toggleFavoriteApp(selectedApp.packageName);
    }
    setMenuVisible(false);
  };

  const handleRename = () => {
    if (!selectedApp) {
      return;
    }
    setMenuVisible(false);
    setRenameValue(selectedApp.displayName);
    setRenameVisible(true);
  };

  const handleRenameSave = () => {
    if (selectedApp) {
      setRenamedApp(selectedApp.packageName, renameValue);
    }
    setRenameVisible(false);
  };

  const handleAppInfo = async () => {
    if (selectedApp) {
      try {
        await Linking.openURL(
          `intent:#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;data=package%3A${selectedApp.packageName};end`
        );
      } catch {
        Alert.alert(
          selectedApp.displayName,
          `Package: ${selectedApp.packageName}`
        );
      }
    }
    setMenuVisible(false);
  };

  const handleUninstall = async () => {
    setMenuVisible(false);
    if (selectedApp) {
      try {
        await Linking.openURL(
          `intent:#Intent;action=android.intent.action.DELETE;data=package%3A${selectedApp.packageName};end`
        );
      } catch {
        Alert.alert('Unavailable', 'Unable to open uninstall dialog.');
      }
    }
  };

  const resolveScrollIndex = (letter: string) => {
    const directIndex = letterIndex.get(letter);
    if (directIndex !== undefined) {
      return directIndex;
    }
    const letterPosition = alphabet.indexOf(letter);
    for (let i = letterPosition + 1; i < alphabet.length; i += 1) {
      const forwardIndex = letterIndex.get(alphabet[i]);
      if (forwardIndex !== undefined) {
        return forwardIndex;
      }
    }
    for (let i = letterPosition - 1; i >= 0; i -= 1) {
      const backwardIndex = letterIndex.get(alphabet[i]);
      if (backwardIndex !== undefined) {
        return backwardIndex;
      }
    }
    return undefined;
  };

  const scrollToLetter = (letter: string) => {
    const targetIndex = resolveScrollIndex(letter);
    if (targetIndex === undefined) {
      return;
    }
    listRef.current?.scrollToIndex({ index: targetIndex, animated: false });
  };

  const handleIndexTouch = (event: GestureResponderEvent) => {
    if (!indexLayout.height) {
      return;
    }
    const relativeY = event.nativeEvent.pageY - indexLayout.top;
    const clampedY = Math.max(0, Math.min(indexLayout.height - 1, relativeY));
    const letterPosition = Math.floor(
      (clampedY / indexLayout.height) * alphabet.length
    );
    const letter = alphabet[letterPosition];
    setActiveLetter(letter);
    scrollToLetter(letter);
  };

  const handleIndexLayout = () => {
    indexRef.current?.measureInWindow((x, y, width, height) => {
      setIndexLayout({ top: y, height });
    });
  };

  const swipeRight = Gesture.Pan()
    .activeOffsetX([20, 9999])
    .failOffsetY([-15, 15])
    .onEnd((event) => {
      if (event.translationX > 60) {
        runOnJS(router.back)();
      }
    });

  return (
    <GestureDetector gesture={swipeRight}>
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
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={theme.colors.muted}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.listWrapper}>
          <FlashList
            ref={listRef}
            data={apps}
            estimatedItemSize={estimatedRowHeight}
            keyExtractor={(item) => item.packageName}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleOpenApp(item)}
                onLongPress={(event) => handleLongPress(event, item)}
                style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
              >
                {settings.showIcons && (
                  <View style={styles.icon}>
                    <AppIcon icon={item.icon} size={28} />
                  </View>
                )}
                <ThemedText type="defaultSemiBold" style={styles.rowText}>
                  {item.displayName}
                </ThemedText>
                {item.isFavorite && (
                  <MaterialCommunityIcons
                    name="star"
                    size={16}
                    color={theme.colors.accent}
                    style={styles.favoriteIcon}
                  />
                )}
              </Pressable>
            )}
            ListEmptyComponent={
              <ThemedText style={{ color: theme.colors.muted }}>
                {loading
                  ? 'Loading apps\u2026'
                  : 'No matches. Try a different search.'}
              </ThemedText>
            }
            contentContainerStyle={styles.listContent}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
          />
          <View
            ref={indexRef}
            style={[styles.indexContainer, { backgroundColor: theme.colors.surface }]}
            onLayout={handleIndexLayout}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleIndexTouch}
            onResponderMove={handleIndexTouch}
            onResponderRelease={() => setActiveLetter(null)}
          >
            {alphabet.map((letter) => (
              <ThemedText
                key={letter}
                style={[
                  styles.indexLetter,
                  {
                    color:
                      activeLetter === letter
                        ? theme.colors.accent
                        : theme.colors.muted,
                  },
                ]}
              >
                {letter}
              </ThemedText>
            ))}
          </View>
        </View>
        <Portal>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={menuAnchor}
            contentStyle={[styles.menuContent, { backgroundColor: theme.colors.surface }]}
          >
            <Menu.Item onPress={handleUninstall} title="Uninstall" />
            <Menu.Item onPress={handleHideApp} title="Hide" />
            <Menu.Item
              onPress={handleToggleFavorite}
              title={
                selectedApp?.isFavorite
                  ? 'Remove from Favorites'
                  : 'Add to Favorites'
              }
            />
            <Menu.Item onPress={handleRename} title="Rename app" />
            <Menu.Item onPress={handleAppInfo} title="App info" />
          </Menu>
          <Dialog visible={renameVisible} onDismiss={() => setRenameVisible(false)}>
            <Dialog.Title>Rename app</Dialog.Title>
            <Dialog.Content>
              <TextInput
                value={renameValue}
                onChangeText={setRenameValue}
                placeholder="Enter new name"
                placeholderTextColor={theme.colors.muted}
                style={[
                  styles.renameInput,
                  { color: theme.colors.text, borderBottomColor: theme.colors.border },
                ]}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setRenameVisible(false)}>Cancel</Button>
              <Button onPress={handleRenameSave}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </GestureDetector>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    fontSize: 16,
    flex: 1,
  },
  listWrapper: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
    paddingRight: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowText: {
    fontSize: 18,
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  favoriteIcon: {
    marginLeft: 8,
  },
  indexContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  indexLetter: {
    fontSize: 11,
    paddingVertical: 1,
    textAlign: 'center',
  },
  menuContent: {
    borderRadius: 12,
  },
  renameInput: {
    borderBottomWidth: 1,
    paddingVertical: 6,
    fontSize: 16,
  },
});
