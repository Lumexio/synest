import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import useGlobalStore from '@/store';
import { Checkbox } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import { ThemedText } from './ThemedText';

const List = ({ lightColor, darkColor }) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const { tasks, setTasks, getTasks } = useGlobalStore();

  const handleCheck = (id) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    newTasks.sort((a, b) => a.completed - b.completed);
    setTasks(newTasks);
  };

  const handleDelete = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  };
  const handleEdit = (id) => {
    const newTasks = tasks.find((task) => task.id === id);
    console.log(newTasks);

    //setTasks(newTasks);
  };

  const renderRightActions = (id: string) => (
    <View style={styles.swipeContainer}>
      <ThemedText onPress={() => handleDelete(id)}>Delete</ThemedText>
    </View>
  );
  const renderLeftActions = (id: string) => (
    <View style={styles.swipeContainer}>
      <ThemedText onPress={() => handleEdit(id)}>Edit</ThemedText>
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
            renderLeftActions={() => renderLeftActions(item.id)}
            renderRightActions={() => renderRightActions(item.id)}
          >
            <View key={item.id} style={styles.itemContainer}>
              <Checkbox
                status={item.completed ? 'checked' : 'unchecked'}
                onPress={() => {
                  handleCheck(item.id);
                }}
              />
              <Text style={[styles.regularText, { color }]}>{item.title}</Text>
            </View>
          </Swipeable>
        )}
      />
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