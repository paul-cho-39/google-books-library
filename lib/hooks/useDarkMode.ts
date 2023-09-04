import { useContext, useEffect } from 'react';
import { ThemeContextParams } from '../types/theme';
import { ThemeContext } from '../context/ThemeContext';

const useDarkMode = () => {
   const context = useContext<ThemeContextParams | undefined>(ThemeContext);
   if (!context) {
      throw new Error('At least one component must be used within ThemeProvider component');
   }

   const { theme, setTheme } = context;

   useEffect(() => {
      if (theme === 'dark') {
         document.body.classList.add('dark');
      } else {
         document.body.classList.remove('dark');
      }
   }, [theme]);

   return { theme, setTheme };
};

export default useDarkMode;
