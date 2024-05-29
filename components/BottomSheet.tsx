import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native-gesture-handler';

const BottomSheetModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const [isOPen, setIsOpen] = React.useState(true);
  // callbacks

  useEffect(() => {
    if (open) {
      sheetRef.current?.snapToIndex(0);
    }
  }, [open]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );
  // renders
  return (
    <BottomSheet
      ref={sheetRef}
      enablePanDownToClose={true}
      snapPoints={snapPoints}
      onClose={() => setIsOpen(false)}
      onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.textTitle}>Task Details</Text>
        <TextInput style={styles.textin} placeholder="Enter task title" />
        <TextInput style={styles.textin} placeholder="Enter task description" />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  textTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  textin: {
    height: 20,
    width: 350,
    borderColor: 'gray',
    margin: 15,

    fontSize: 20,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default BottomSheetModal;
