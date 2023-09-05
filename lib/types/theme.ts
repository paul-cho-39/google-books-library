import { Session } from 'next-auth';
import { IconProps } from '../../components/icons/headerIcons';

export type ColorTheme = 'light' | 'dark';

export type ThemeContextParams = {
   theme: ColorTheme;
   setTheme: React.Dispatch<React.SetStateAction<ColorTheme>>;
};

export type ThemeContextStyleParams = {
   className: string;
} & ThemeContextParams;

export interface NavigationProps {
   user: Session | null;
   userId: string | null;
   icons: IconProps;
   theme: ThemeContextParams;
   url: string;
}
