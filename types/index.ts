interface ITask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}
interface IModalData {
  params: object;
  porpouse: string;
  modalBool: boolean;
}
type ThemeMode = 'light' | 'dark' | 'system';
type ThemePreset = 'mono' | 'paper' | 'midnight';
type FontFamily = 'system' | 'serif' | 'monospace';

interface IAppSettings {
  themeMode: ThemeMode;
  themePreset: ThemePreset;
  accentColor: string | null;
  backgroundLight: string | null;
  backgroundDark: string | null;
  fontFamily: FontFamily;
  showDayProgress: boolean;
  showYearProgress: boolean;
  showWeather: boolean;
  showScreenTime: boolean;
  showTasks: boolean;
  showIcons: boolean;
  autoFocusSearch: boolean;
  hiddenApps: string[];
  renamedApps: Record<string, string>;
}
