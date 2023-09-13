import { categories } from '../../constants/categories';

export interface ReactIconProps extends React.SVGProps<SVGSVGElement> {
   className?: string;
}

const HomeIcon = () => {
   return (
      <svg
         className='mr-4 h-8 w-8 text-blue-gray-400 group-hover:text-blue-gray-500'
         xmlns='http://www.w3.org/2000/svg'
         fill='none'
         viewBox='0 0 24 24'
         stroke-width='1.5'
         stroke='currentColor'
         aria-hidden='true'
      >
         <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
         />
      </svg>
   );
};

const Profile = () => {
   return (
      <svg
         className='mr-4 h-8 w-8 text-blue-gray-400 group-hover:text-blue-gray-500'
         xmlns='http://www.w3.org/2000/svg'
         fill='none'
         viewBox='0 0 24 24'
         stroke-width='1.5'
         stroke='currentColor'
         aria-hidden='true'
      >
         <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
         />
      </svg>
   );
};

const Book = () => {
   return (
      <svg
         xmlns='http://www.w3.org/2000/svg'
         fill='none'
         viewBox='0 0 24 24'
         stroke-width='1.5'
         stroke='currentColor'
         className='mr-4 h-8 w-8 group-hover:text-blue-gray-500'
      >
         <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'
         />
      </svg>
   );
};

const MagnifyingGlass = () => {
   return (
      <svg
         xmlns='http://www.w3.org/2000/svg'
         fill='none'
         viewBox='0 0 24 24'
         stroke-width='1.5'
         stroke='currentColor'
         className='mr-4 h-8 w-8 group-hover:text-blue-gray-500'
      >
         <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
         />
      </svg>
   );
};

export interface Navigation {
   name?: string;
   href?: string;
   current?: boolean;
}

export type NavigationParams = 'home' | 'profile' | 'categories';
export type IconProps = Record<NavigationParams, Icons>;

export type Icons = {
   icon: () => JSX.Element;
   href: string;
   name: string;
   subsection?: Navigation[];
};

const IconProviders: IconProps = {
   home: {
      icon: HomeIcon,
      href: '/',
      name: 'Home',
   },
   profile: {
      icon: Profile,
      href: '/settings',
      name: 'Profile',
   },
   categories: {
      icon: Book,
      href: '/categories',
      name: 'Categories',
      subsection: getNavigation(categories),
   },
   // search: {
   //    icon: MagnifyingGlass,
   //    href: '/searchbooks',
   //    name: 'Search',
   // },
};

function getNavigation(categories: readonly string[]) {
   return categories.map((category) => ({
      name: category,
      href: category,
      current: false,
   }));
}

export default IconProviders;
