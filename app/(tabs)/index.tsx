import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import List from '@/components/Flashlist';
import { FAB } from 'react-native-paper';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export default function HomeScreen({ lightColor, darkColor }: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[{ backgroundColor }, styles.container]}>
        <List />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => console.log('Pressed')}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
  },
});
