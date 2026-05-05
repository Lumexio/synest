export type AppEntry = {
  id: string;
  name: string;
  icon: string;
  url?: string;
};

export const mockApps: AppEntry[] = [
  { id: 'app-store', name: 'App Store', icon: 'apps', url: 'https://play.google.com' },
  { id: 'banking', name: 'Banking', icon: 'bank-outline' },
  { id: 'browser', name: 'Browser', icon: 'web', url: 'https://www.google.com' },
  { id: 'calendar', name: 'Calendar', icon: 'calendar-month-outline' },
  { id: 'calculator', name: 'Calculator', icon: 'calculator-variant-outline' },
  { id: 'camera', name: 'Camera', icon: 'camera-outline' },
  { id: 'clock', name: 'Clock', icon: 'clock-outline' },
  { id: 'contacts', name: 'Contacts', icon: 'account-box-outline' },
  { id: 'drive', name: 'Drive', icon: 'cloud-outline' },
  { id: 'files', name: 'Files', icon: 'folder-outline' },
  { id: 'gallery', name: 'Gallery', icon: 'image-multiple-outline' },
  { id: 'gmail', name: 'Gmail', icon: 'email-outline', url: 'mailto:' },
  { id: 'maps', name: 'Maps', icon: 'map-outline', url: 'https://maps.google.com' },
  { id: 'messages', name: 'Messages', icon: 'message-text-outline', url: 'sms:' },
  { id: 'music', name: 'Music', icon: 'music-note-outline' },
  { id: 'news', name: 'News', icon: 'newspaper-variant-outline' },
  { id: 'notes', name: 'Notes', icon: 'note-outline' },
  { id: 'phone', name: 'Phone', icon: 'phone', url: 'tel:' },
  { id: 'photos', name: 'Photos', icon: 'image-outline' },
  { id: 'podcasts', name: 'Podcasts', icon: 'podcast' },
  { id: 'settings', name: 'Settings', icon: 'cog-outline' },
  { id: 'shop', name: 'Shop', icon: 'shopping-outline' },
  { id: 'spotify', name: 'Spotify', icon: 'spotify', url: 'https://open.spotify.com' },
  { id: 'tasks', name: 'Tasks', icon: 'checkbox-marked-outline' },
  { id: 'terminal', name: 'Terminal', icon: 'console-line' },
  { id: 'weather', name: 'Weather', icon: 'weather-cloudy' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com' },
];
