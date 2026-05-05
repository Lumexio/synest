export type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  border: string;
};

export const themePresets: Record<ThemePreset, { light: ThemeColors; dark: ThemeColors }> = {
  mono: {
    light: {
      background: '#F6F5F2',
      surface: '#FFFFFF',
      text: '#1B1B1B',
      muted: '#6B6B6B',
      accent: '#2E2E2E',
      border: '#E0DED8',
    },
    dark: {
      background: '#121212',
      surface: '#1C1C1C',
      text: '#F2F2F2',
      muted: '#A0A0A0',
      accent: '#E8E8E8',
      border: '#2A2A2A',
    },
  },
  paper: {
    light: {
      background: '#FAF4E8',
      surface: '#FFFFFF',
      text: '#20201E',
      muted: '#7A7264',
      accent: '#C08F42',
      border: '#E7D9C1',
    },
    dark: {
      background: '#191713',
      surface: '#24211C',
      text: '#F5F1E6',
      muted: '#C3B8A6',
      accent: '#D8A24D',
      border: '#2F2B24',
    },
  },
  midnight: {
    light: {
      background: '#F2F5FA',
      surface: '#FFFFFF',
      text: '#1B2430',
      muted: '#4E6075',
      accent: '#2563EB',
      border: '#D5DDE8',
    },
    dark: {
      background: '#0B1120',
      surface: '#121A2B',
      text: '#E6EDF7',
      muted: '#93A4BE',
      accent: '#60A5FA',
      border: '#1F2A44',
    },
  },
};

export const accentOptions = ['#2E2E2E', '#2563EB', '#C08F42', '#0EA5E9', '#10B981'];

export const backgroundOptions = {
  light: ['#F6F5F2', '#FAF4E8', '#F2F5FA', '#FFFFFF'],
  dark: ['#121212', '#191713', '#0B1120', '#000000'],
};

export const fontOptions: { key: FontFamily; label: string; fontFamily?: string }[] = [
  { key: 'system', label: 'System' },
  { key: 'serif', label: 'Serif', fontFamily: 'serif' },
  { key: 'monospace', label: 'Mono', fontFamily: 'monospace' },
];

export type ThemeColorName = keyof ThemeColors;
