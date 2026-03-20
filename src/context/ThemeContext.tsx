import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';

export interface ThemeColors {
  background: string;
  text: string;
  card: string;
  border: string;
  primary: string;
  secondary: string;
}

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  text: '#000000',
  card: '#F5F5F5',
  border: '#E0E0E0',
  primary: '#ffb2d6',
  secondary: '#fc6497',
};

const darkColors: ThemeColors = {
  background: '#121212',
  text: '#FFFFFF',
  card: '#1E1E1E',
  border: '#333333',
  primary: '#ffb2d6',
  secondary: '#fc6497',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsDark((currentValue) => !currentValue);
  }, []);

  const colors = isDark ? darkColors : lightColors;
  const value = useMemo(
    () => ({
      isDark,
      colors,
      toggleTheme,
    }),
    [colors, isDark, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
