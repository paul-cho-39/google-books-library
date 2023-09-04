export type ColorTheme = 'light' | 'dark';

export type ThemeContextParams = {
   theme: ColorTheme;
   setTheme: React.Dispatch<React.SetStateAction<ColorTheme>>;
};

export type ThemeContextStyleParams = {
   className: string;
} & ThemeContextParams;
