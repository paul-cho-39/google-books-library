import { SunIcon, MoonIcon } from '@heroicons/react/20/solid';
import { ThemeContextStyleParams } from '../../lib/types/theme';
import clsx from 'clsx';

export const ThemeToggler = ({ theme, setTheme, className }: ThemeContextStyleParams) => {
   const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);

      window.localStorage.setItem('theme', newTheme);
   };

   return (
      <button
         aria-hidden={true}
         onClick={toggleTheme}
         className='p-2 rounded-full focus:outline-none focus:ring'
      >
         {theme === 'light' ? (
            <SunIcon className={clsx('stroke-yellow-500 fill-yellow-300', className)} />
         ) : (
            <MoonIcon className={clsx('stroke-slate-100', className)} />
         )}
      </button>
   );
};
