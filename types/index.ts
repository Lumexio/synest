export interface ITask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}
export interface IModalData {
  params: object;
  purpose: string;
  modalBool: boolean;
}
export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemePreset = 'mono' | 'paper' | 'midnight';
export type FontFamily = 'system' | 'serif' | 'monospace';

export interface IAppSettings {
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
