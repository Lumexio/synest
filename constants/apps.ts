export type AppEntry = {
  id: string;
  name: string;
  icon: string;
};

export const mockApps: AppEntry[] = [
  { id: 'phone', name: 'Phone', icon: 'phone' },
  { id: 'messages', name: 'Messages', icon: 'message-text-outline' },
  { id: 'camera', name: 'Camera', icon: 'camera-outline' },
  { id: 'calendar', name: 'Calendar', icon: 'calendar-month-outline' },
  { id: 'notes', name: 'Notes', icon: 'note-outline' },
  { id: 'maps', name: 'Maps', icon: 'map-outline' },
  { id: 'music', name: 'Music', icon: 'music-note-outline' },
  { id: 'settings', name: 'Settings', icon: 'cog-outline' },
];
