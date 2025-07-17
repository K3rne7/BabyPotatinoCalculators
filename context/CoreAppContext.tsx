import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { CalculatorMode, Theme } from '../types';

interface CoreAppContextType {
  mode: CalculatorMode;
  setMode: (mode: CalculatorMode) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isHistoryVisible: boolean;
  toggleHistory: () => void;
  closeHistory: () => void;
  isSettingsVisible: boolean;
  toggleSettings: () => void;
  closeSettings: () => void;
}

export const CoreAppContext = createContext<CoreAppContextType | undefined>(undefined);

export const CoreAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<CalculatorMode>(CalculatorMode.Basic);
  const [theme, setThemeState] = useState<Theme>('system');
  const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);

  // Load theme from localStorage on initial mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('calculator-theme') as Theme | null;
    if (savedTheme) setThemeState(savedTheme);
  }, []);

  // Persist theme and apply it to the document
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => document.documentElement.classList.toggle('dark', mediaQuery.matches);
      document.documentElement.classList.toggle('dark', mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    localStorage.setItem('calculator-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  const toggleHistory = () => {
    setIsHistoryVisible(prev => !prev);
  }

  const closeHistory = () => {
    setIsHistoryVisible(false);
  }

  const toggleSettings = () => {
    setIsSettingsVisible(prev => !prev);
  }

  const closeSettings = () => {
    setIsSettingsVisible(false);
  }


  const value = {
    mode,
    setMode,
    theme,
    setTheme,
    isHistoryVisible,
    toggleHistory,
    closeHistory,
    isSettingsVisible,
    toggleSettings,
    closeSettings,
  };

  return <CoreAppContext.Provider value={value}>{children}</CoreAppContext.Provider>;
};
