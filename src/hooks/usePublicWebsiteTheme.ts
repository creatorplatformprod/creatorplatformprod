import { useState, useEffect } from 'react';

const THEME_KEY_PREFIX = 'siteTheme:';

/**
 * Returns the classic dark theme class when the user has selected "Classic" for this creator's public website.
 * Used on CreatorProfile, Collections, PostDetail, PostDetailBlurred so theme is consistent across all public/preview pages.
 * Listens for postMessage TOGGLE_THEME when inside preview iframe.
 */
export function usePublicWebsiteTheme(creatorUsername: string | undefined): string {
  const themeKey = creatorUsername ? `${THEME_KEY_PREFIX}${creatorUsername}` : null;

  const [useClassicTheme, setUseClassicTheme] = useState(() => {
    if (typeof window === 'undefined' || !themeKey) return false;
    const saved = localStorage.getItem(themeKey);
    return saved === 'classic';
  });

  useEffect(() => {
    if (!themeKey) return;
    const saved = localStorage.getItem(themeKey);
    setUseClassicTheme(saved === 'classic');
  }, [themeKey]);

  useEffect(() => {
    if (!themeKey) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'TOGGLE_THEME') {
        setUseClassicTheme((prev) => {
          const next = !prev;
          localStorage.setItem(themeKey, next ? 'classic' : 'modern');
          return next;
        });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [themeKey]);

  return useClassicTheme ? 'theme-classic-dark' : '';
}

