import React, { useState } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetModal from '@/components/BottomSheet';
import List from '@/components/Flashlist';
import { FAB } from 'react-native-paper';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export default function HomeScreen({ lightColor, darkColor }: ThemedViewProps) {
  let [isModalOpen, setModalOpen] = useState(false);

  const handleFabPress = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );
  return (
    <View style={[{ backgroundColor }, styles.container]}>
      <GestureHandlerRootView>
        <StatusBar
          backgroundColor={backgroundColor}
          animated={true}
        ></StatusBar>
        <List />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => {
            handleFabPress();
          }}
        />
        <BottomSheetModal
          open={isModalOpen}
          onClose={closeModal}
        ></BottomSheetModal>
      </GestureHandlerRootView>
    </View>
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
