import { useEffect, useState } from 'react';

export function useColorScheme() {
  const getScheme = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const [scheme, setScheme] = useState(getScheme());

  useEffect(() => {
    if (!window?.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setScheme(mediaQuery.matches ? 'dark' : 'light');

    handler();
    mediaQuery.addEventListener?.('change', handler);
    return () => mediaQuery.removeEventListener?.('change', handler);
  }, []);

  return scheme;
}
