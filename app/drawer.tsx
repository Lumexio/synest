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
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { mockApps } from '@/constants/apps';
import useGlobalStore from '@/store';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type DrawerApp = (typeof mockApps)[number] & {
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
  const { settings, toggleHiddenApp, toggleFavoriteApp, setRenamedApp } =
    useGlobalStore();

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
        isFavorite: settings.favoriteApps.includes(app.id),
      }))
      .filter((app) => app.displayName.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) => {
        if (a.isFavorite !== b.isFavorite) {
          return a.isFavorite ? -1 : 1;
        }
        return a.displayName.localeCompare(b.displayName);
      });
  }, [query, settings.hiddenApps, settings.renamedApps, settings.favoriteApps]);

  const letterIndex = useMemo(() => {
    const map = new Map<string, number>();
    apps.forEach((app, index) => {
      const trimmed = app.displayName.trim();
      const firstChar = trimmed.charAt(0).toUpperCase();
      const normalized = alphabet.includes(firstChar) ? firstChar : '#';
      if (!map.has(normalized)) {
        map.set(normalized, index);
      }
    });
    return map;
  }, [apps]);

  const handleOpenApp = async (app: DrawerApp) => {
    if (!app.url) {
      Alert.alert('Unavailable', 'Launching this app is not supported in the demo.');
      return;
    }
    try {
      const canOpen = await Linking.canOpenURL(app.url);
      if (!canOpen) {
        Alert.alert('Unavailable', 'This app cannot be opened on this device.');
        return;
      }
      await Linking.openURL(app.url);
    } catch (error) {
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
      toggleHiddenApp(selectedApp.id);
    }
    setMenuVisible(false);
  };

  const handleToggleFavorite = () => {
    if (selectedApp) {
      toggleFavoriteApp(selectedApp.id);
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
      setRenamedApp(selectedApp.id, renameValue);
    }
    setRenameVisible(false);
  };

  const handleAppInfo = () => {
    if (selectedApp) {
      Alert.alert(
        selectedApp.displayName,
        `ID: ${selectedApp.id}\n${selectedApp.isFavorite ? 'Favourite' : 'Not favourite'}`
      );
    }
    setMenuVisible(false);
  };

  const handleUninstall = () => {
    setMenuVisible(false);
    Alert.alert('Unavailable', 'Uninstalling apps is not supported in the demo.');
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
    const letterPosition = Math.floor((clampedY / indexLayout.height) * alphabet.length);
    const letter = alphabet[Math.max(0, Math.min(alphabet.length - 1, letterPosition))];
    setActiveLetter(letter);
    scrollToLetter(letter);
  };

  const handleIndexLayout = () => {
    indexRef.current?.measureInWindow((x, y, width, height) => {
      setIndexLayout({ top: y, height });
    });
  };

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

      <View style={styles.listWrapper}>
        <FlashList
          ref={listRef}
          data={apps}
          estimatedItemSize={52}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleOpenApp(item)}
              onLongPress={(event) => handleLongPress(event, item)}
              style={({ pressed }) => [
                styles.row,
                pressed && { opacity: 0.6 },
              ]}
            >
              {settings.showIcons && (
                <MaterialCommunityIcons
                  name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                  size={20}
                  color={theme.colors.muted}
                  style={styles.icon}
                />
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
              No matches. Try a different search.
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
                    activeLetter === letter ? theme.colors.accent : theme.colors.muted,
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
            title={selectedApp?.isFavorite ? 'Remove from favourites' : 'Add to favourites'}
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
