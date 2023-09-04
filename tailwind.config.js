// lets try to change the font family to determine which works the best
/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

const notFirst = plugin(({ addVariant, e }) => {
   addVariant('not-first', ({ modifySelectors, separator }) => {
      modifySelectors(({ className }) => {
         const element = e(`not-first${separator}${className}`);
         return `.${element} > :not(:first-child)`;
      });
   });
});

module.exports = {
   content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
   darkMode: 'class',
   extend: {
      keyframes: {
         dots: {
            '0%': {
               content: "''",
            },
            '33%': {
               content: "'.'",
            },
            '66%': {
               content: "'..'",
            },
            '100%': {
               content: "'...'",
            },
         },
      },
      animation: {
         dot: 'dots ease-in-out 2s infinite',
      },
      colors: {
         'blue-gray': colors.slate,
      },
      screens: {
         sm: '720px',
         md: '892px',
         lg: '937px',
         xl: '1225px',
      },
   },
   fontFamily: {
      primary: 'Oswald',
      secondary: 'Raleway',
      tertiary: 'Rozha One',
   },
   plugins: [notFirst, require('@tailwindcss/line-clamp'), require('@tailwindcss/forms')],
};
