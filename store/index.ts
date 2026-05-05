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
  toggleFavoriteApp: (appId: string) => void;
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
        favoriteApps: [],
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
      toggleFavoriteApp: (appId: string) =>
        set((state) => {
          const favoriteApps = state.settings.favoriteApps.includes(appId)
            ? state.settings.favoriteApps.filter((id) => id !== appId)
            : [...state.settings.favoriteApps, appId];
          return { settings: { ...state.settings, favoriteApps } };
        }),
      setRenamedApp: (appId: string, name: string) =>
        set((state) => {
          const trimmed = name.trim();
          const renamedApps = { ...state.settings.renamedApps };
          if (trimmed.length === 0) {
            delete renamedApps[appId];
          } else {
            renamedApps[appId] = trimmed;
          }
          return {
            settings: {
              ...state.settings,
              renamedApps,
            },
          };
        }),
    }),
    {
      name: 'todo-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
export default useGlobalStore;
