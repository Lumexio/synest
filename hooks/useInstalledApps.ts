import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { InstalledApps } from 'react-native-launcher-kit';
import type { AppDetail } from 'react-native-launcher-kit/typescript/Interfaces/InstalledApps';

export type { AppDetail };

export function useInstalledApps() {
  const [apps, setApps] = useState<AppDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApps = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setLoading(false);
      return;
    }
    try {
      const result = await InstalledApps.getSortedApps({
        includeVersion: false,
        includeAccentColor: false,
      });
      setApps(result);
    } catch {
      // Native module unavailable (Expo Go / non-Android)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApps();

    if (Platform.OS !== 'android') {
      return;
    }

    InstalledApps.startListeningForAppInstallations(() => {
      loadApps();
    });
    InstalledApps.startListeningForAppRemovals(() => {
      loadApps();
    });

    return () => {
      InstalledApps.stopListeningForAppInstallations();
      InstalledApps.stopListeningForAppRemovals();
    };
  }, [loadApps]);

  return { apps, loading, refresh: loadApps };
}
