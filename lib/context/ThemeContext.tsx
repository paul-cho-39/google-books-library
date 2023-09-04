import { createContext, useState, useEffect } from 'react';
import { ColorTheme, ThemeContextParams } from '../types/theme';

export const ThemeContext = createContext<ThemeContextParams | undefined>(undefined);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
   const [theme, setTheme] = useState<ColorTheme>('light');

   useEffect(() => {
      const localTheme = window.localStorage.getItem('theme') as ColorTheme;
      setTheme(localTheme || 'light');
   }, []);

   return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
