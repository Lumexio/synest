import React, { useState } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetModal from '@/components/BottomSheet';
import List from '@/components/ListTask';
import { FAB } from 'react-native-paper';
import { useThemeColor } from '@/hooks/useThemeColor';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

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

  const bColor = useThemeColor(
    {
      light: lightColor != undefined ? lightColor : '#FAFA55',
      dark: darkColor != undefined ? darkColor : '#303030',
    },
    'background'
  );
  setStatusBarBackgroundColor(bColor, true);
  return (
    <View style={[{ backgroundColor: bColor }, styles.container]}>
      <GestureHandlerRootView>
        <List />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => {
            handleFabPress();
          }}
        />
        <BottomSheetModal
          editCreateFlag=""
          taskData={{ title: '', description: '', id: '', completed: false }}
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
