import React, { FC, useState } from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import useGlobalStore from '@/store';
import { Checkbox } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import { ThemedText } from './ThemedText';
import BottomSheetModal from '@/components/BottomSheet';
export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};
let taskData = { title: '', description: '', id: '', completed: false };
let editCreateFlag = '';
interface ListProps {
  lightColor?: string;
  darkColor?: string;
}

const List: FC<ListProps> = ({ lightColor, darkColor }) => {
  // const List = ({ lightColor, darkColor }: ThemedViewProps) => {
  let [isModalOpen, setModalOpen] = useState(false);
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const { tasks, setTasks, getTasks } = useGlobalStore();

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleCheck = (id: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    newTasks.sort((a, b) => Number(a.completed) - Number(b.completed));
    setTasks(newTasks);
  };

  const handleDelete = (id: string) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  };
  const handleEdit = (item: any) => {
    taskData = item;
    editCreateFlag = 'edit';
    setModalOpen(true);

    //setTasks(newTasks);
  };

  const renderRightActions = (id: string) => (
    <View style={styles.swipeContainer}>
      <ThemedText onPress={() => handleDelete(id)}>Delete</ThemedText>
    </View>
  );
  const renderLeftActions = (item: object) => (
    <View style={styles.swipeContainer}>
      <ThemedText onPress={() => handleEdit(item)}>Edit</ThemedText>
    </View>
  );

  return (
    <View style={styles.listContainer}>
      <FlashList
        data={tasks}
        estimatedItemSize={100}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderLeftActions={() => renderLeftActions(item)}
            renderRightActions={() => renderRightActions(item.id)}
          >
            <View key={item.id} style={styles.itemContainer}>
              <Checkbox
                status={item.completed ? 'checked' : 'unchecked'}
                onPress={() => {
                  handleCheck(item.id);
                }}
              />
              <ThemedText style={[styles.regularText, { color }]}>
                {item.title}
              </ThemedText>
            </View>
          </Swipeable>
        )}
      />
      <BottomSheetModal
        taskData={taskData}
        editCreateFlag={editCreateFlag}
        open={isModalOpen}
        onClose={closeModal}
      ></BottomSheetModal>
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  regularText: {
    fontSize: 20,
    fontFamily: 'monospace',
  },
  itemContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },

  swipeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    backgroundColor: 'glassblue',
  },
});
