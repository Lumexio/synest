import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
interface IGlobalTaskState {
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
  getTasks: () => ITask[];
}

const useGlobalStore = create<IGlobalTaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      setTasks: (newTasks: ITask[]) => set({ tasks: newTasks }),
      getTasks: () => get().tasks,
    }),
    {
      name: 'todo-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
export default useGlobalStore;
