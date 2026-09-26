import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'doit-theme';
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = (): 'light' | 'dark' =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
    } catch {
      // Private browsing can deny storage access; system theme still works.
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // Fall back to the device preference.
    }
    return getSystemTheme();
  });

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const nextResolved = theme === 'system' ? getSystemTheme() : theme;
      setResolvedTheme(nextResolved);
      root.classList.toggle('dark', nextResolved === 'dark');
      root.dataset.theme = nextResolved;
    };

    applyTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') applyTheme();
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Keep the current session usable when storage is unavailable.
    }
  };

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};