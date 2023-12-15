import { Session } from 'next-auth';
import { IconProps } from '@/components/icons/headerIcons';
import { FilterProps } from './googleBookTypes';

export type ColorTheme = 'light' | 'dark';

export type ThemeContextParams = {
   theme: ColorTheme;
   setTheme: React.Dispatch<React.SetStateAction<ColorTheme>>;
};

export type FilterContextParams = {
   filter: FilterProps;
   setFilter: React.Dispatch<React.SetStateAction<FilterProps>>;
};

export type ThemeContextStyleParams = {
   className: string;
} & ThemeContextParams;

export interface NavigationProps {
   user: Session | null;
   userId: string | null;
   icons: Partial<IconProps>;
   darkTheme: ThemeContextParams;
   // url: string;
   signOut: () => void;
}

export interface LayoutBase {
   children: React.ReactNode;
   isLoading: boolean;
}
