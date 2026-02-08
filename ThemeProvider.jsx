import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.theme) {
          setTheme(user.theme);
          applyTheme(user.theme);
        }
      } catch (e) {
        applyTheme('dark');
      }
    };
    loadTheme();
  }, []);

  const applyTheme = (newTheme) => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  const toggleTheme = async (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    try {
      await base44.auth.updateMe({ theme: newTheme });
    } catch (e) {}
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}