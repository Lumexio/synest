import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native-gesture-handler';
import useGlobalStore from '@/store';
import { Button } from 'react-native-paper';

const BottomSheetModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { tasks, setTasks } = useGlobalStore();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const [isOPen, setIsOpen] = React.useState(true);

  const [task, setTask] = React.useState({ title: '', description: '' });

  useEffect(() => {
    if (open) {
      sheetRef.current?.snapToIndex(0);
    }
  }, [open]);
  // callbacks

  const handleTaskChange = (field: string, value: string) => {
    setTask((prevTask) => ({ ...prevTask, [field]: value }));
  };

  const handleAddTask = () => {
    if (task.title && task.description) {
      const newTask = {
        ...task,
        id: `${tasks.length + 1}`,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setTask({ title: '', description: '' });

      onClose();
    }
  };

  const handleSubmitEditing = () => {
    if (task.title && task.description) {
      handleAddTask();
    }
  };

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
        <TextInput
          onChangeText={(text) => handleTaskChange('title', text)}
          style={styles.textin}
          value={task.title}
          placeholder="Enter task title"
        />
        <TextInput
          onChangeText={(text) => handleTaskChange('description', text)}
          style={styles.textin}
          value={task.description}
          placeholder="Enter task description"
        />
        <Pressable style={styles.button} onPress={handleAddTask}>
          <Text style={styles.text}>Save</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
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
