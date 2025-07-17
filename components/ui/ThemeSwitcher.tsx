import React from 'react';
import { useCoreAppContext } from '../../hooks/useCoreAppContext';
import { Theme } from '../../types';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v-1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
);


const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useCoreAppContext();

  const themes: { name: Exclude<Theme, 'system'>; icon: React.ReactNode }[] = [
    { name: 'light', icon: <SunIcon /> },
    { name: 'dark', icon: <MoonIcon /> },
  ];

  return (
    <div className="flex items-center bg-base-300/50 rounded-full p-1 justify-around">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-full transition-all duration-300 ${
            theme === t.name ? 'bg-primary text-white shadow-md' : 'text-base-content/70 hover:bg-base-100/50'
          }`}
          aria-label={`Switch to ${t.name} theme`}
          aria-pressed={theme === t.name}
        >
          {t.icon}
          <span className="capitalize text-sm font-semibold">{t.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;