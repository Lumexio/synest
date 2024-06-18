import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
interface IGlobalTaskState {
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
  getTasks: () => ITask[];
  setModalData: (modalData: IModalData) => void;
  modalData: IModalData;
}

const useGlobalStore = create<IGlobalTaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      modalData: { params: {}, modalBool: false, porpouse: '' },
      setTasks: (newTasks: ITask[]) => set({ tasks: newTasks }),

      getTasks: () => get().tasks,
      setModalData: (newModalData: IModalData) =>
        set({ modalData: newModalData }),
      getModalData: () => get().modalData,
    }),
    {
      name: 'todo-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
export default useGlobalStore;
