import React, { createContext, useContext, useState } from 'react';

type ThemeMode = 'dark' | 'light' | 'azure';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={theme === 'light' ? 'bg-slate-50 text-slate-900' : theme === 'azure' ? 'bg-slate-950 text-sky-100' : 'bg-slate-950 text-slate-100'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
