import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { IAppSettings, IModalData, ITask } from '@/types';
interface IGlobalTaskState {
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
  getTasks: () => ITask[];
  setModalData: (modalData: IModalData) => void;
  modalData: IModalData;
  getModalData: () => IModalData;
  settings: IAppSettings;
  setSettings: (settings: Partial<IAppSettings>) => void;
  toggleHiddenApp: (appId: string) => void;
  setRenamedApp: (appId: string, name: string) => void;
}

const useGlobalStore = create<IGlobalTaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      modalData: { params: {}, modalBool: false, purpose: '' },
      settings: {
        themeMode: 'system',
        themePreset: 'mono',
        accentColor: null,
        backgroundLight: null,
        backgroundDark: null,
        fontFamily: 'system',
        showDayProgress: true,
        showYearProgress: true,
        showWeather: true,
        showScreenTime: true,
        showTasks: true,
        showIcons: false,
        autoFocusSearch: true,
        hiddenApps: [],
        renamedApps: {},
      },
      setTasks: (newTasks: ITask[]) => set({ tasks: newTasks }),

      getTasks: () => get().tasks,
      setModalData: (newModalData: IModalData) =>
        set({ modalData: newModalData }),
      getModalData: () => get().modalData,
      setSettings: (updates: Partial<IAppSettings>) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      toggleHiddenApp: (appId: string) =>
        set((state) => {
          const hiddenApps = state.settings.hiddenApps.includes(appId)
            ? state.settings.hiddenApps.filter((id) => id !== appId)
            : [...state.settings.hiddenApps, appId];
          return { settings: { ...state.settings, hiddenApps } };
        }),
      setRenamedApp: (appId: string, name: string) =>
        set((state) => ({
          settings: {
            ...state.settings,
            renamedApps: { ...state.settings.renamedApps, [appId]: name },
          },
        })),
    }),
    {
      name: 'todo-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
export default useGlobalStore;
