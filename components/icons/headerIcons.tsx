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
         className='mr-4 h-8 w-8 group-hover:text-blue-gray-500'
         xmlns='http://www.w3.org/2000/svg'
         viewBox='0 0 512 512'
      >
         <g transform='translate(0,0)'>
            <path
               d='M196.73 35.23c-8.132.878-16.3 1.936-24.515 3.172C192.968 50.21 212.045 66.795 224 96c-24.896-22.512-44.232-39.5-75.795-53.512-8.808 1.676-17.69 3.562-26.656 5.64 22.69 10.745 49.026 26.094 75.114 51.306-57.456-25.454-81.792-31.066-120.23-39.4C64.33 63.598 52.03 67.5 39.5 71.743c54.813 3.532 103.127 19.644 187.346 47.717l2.015.673 1.503 1.504c5.794 5.793 15.356 9.254 25.203 9.353-2.725-39.43-18.787-67.802-58.836-95.76zm118.54 0c-40.05 27.958-56.11 56.33-58.836 95.76 9.847-.1 19.41-3.56 25.203-9.353l1.502-1.504 2.014-.672C369.374 91.39 417.687 75.277 472.5 71.745c-12.53-4.243-24.83-8.145-36.934-11.71-38.438 8.334-62.774 13.946-120.23 39.4 26.088-25.212 52.424-40.56 75.115-51.307-8.964-2.077-17.847-3.963-26.655-5.64-31.563 14.014-50.9 31-75.795 53.513 11.954-29.205 31.032-45.79 51.785-57.598-8.216-1.236-16.383-2.294-24.515-3.172zM25 89.287v301.758c44.68.19 106.01 16.813 190 44.498v-301.04C128.034 105.534 81.67 90.71 25 89.288zm462 0c-56.67 1.423-103.034 16.246-190 45.217v301.05c84.317-27.698 143.413-42.5 190-44.2V89.287zm-254 55.195v200.325c15.47 3.1 30.71 3.292 46 .097V144.482c-7.227 3.058-15.14 4.518-23 4.518-7.86 0-15.773-1.46-23-4.518zm0 218.627v13.933c15.296 3.488 30.512 3.284 46-.1V363.22c-15.37 2.728-30.764 2.543-46-.11zm46 32.185c-15.226 2.856-30.633 3.058-46 .125v48.838c3.222 3.24 5.775 5.876 8.365 7.56 3.283 2.136 6.77 3.49 14.274 3.19l.18-.008h.18c11.61 0 15.954-4.04 23-10.836v-48.87z'
               fill='#fff'
               fill-opacity='1'
               stroke='#000000'
               stroke-opacity='1'
               stroke-width='8'
            ></path>
         </g>
      </svg>
   );
};

const MagnifyingGlass = () => {
   return (
      <svg
         className='mr-4 h-8 w-8 group-hover:text-blue-gray-500'
         xmlns='http://www.w3.org/2000/svg'
         viewBox='0 0 512 512'
      >
         <g transform='translate(0,0)'>
            <path
               d='M333.78 20.188c-39.97 0-79.96 15.212-110.405 45.656-58.667 58.667-60.796 152.72-6.406 213.97l-15.782 15.748 13.25 13.25 15.75-15.78c61.248 54.39 155.3 52.26 213.968-6.407 60.887-60.886 60.888-159.894 0-220.78C413.713 35.4 373.753 20.187 333.78 20.187zm0 18.562c35.15 0 70.285 13.44 97.158 40.313 53.745 53.745 53.744 140.6 0 194.343-51.526 51.526-133.46 53.643-187.5 6.375l.218-.217c-2.35-2.05-4.668-4.17-6.906-6.407-2.207-2.206-4.288-4.496-6.313-6.812l-.218.22c-47.27-54.04-45.152-135.976 6.374-187.502C263.467 52.19 298.63 38.75 333.78 38.75zm0 18.813c-30.31 0-60.63 11.6-83.81 34.78-46.362 46.362-46.362 121.234 0 167.594 10.14 10.142 21.632 18.077 33.905 23.782-24.91-19.087-40.97-49.133-40.97-82.94 0-15.323 3.292-29.888 9.22-43-4.165 20.485.44 40.88 14.47 54.907 24.583 24.585 68.744 20.318 98.624-9.562 29.88-29.88 34.146-74.04 9.56-98.625-2.375-2.376-4.943-4.473-7.655-6.313 45.13 8.648 79.954 46.345 84.25 92.876 4.44-35.07-6.82-71.726-33.813-98.72-23.18-23.18-53.47-34.78-83.78-34.78zM176.907 297.688L42.094 432.5l34.562 34.563L211.47 332.25l-34.564-34.563zM40 456.813L24 472.78 37.22 486l15.968-16L40 456.812z'
               fill='#fff'
               fill-opacity='1'
               stroke='#000000'
               stroke-opacity='1'
               stroke-width='8'
            ></path>
         </g>
      </svg>
   );
};

type IconProps = {
   [key: string]: Icons;
};

type Icons = {
   icon: () => JSX.Element;
   href: string;
   name: string;
};

const IconProviders: IconProps = {
   home: {
      icon: HomeIcon,
      href: '/',
      name: 'Home',
   },
   book: {
      icon: Book,
      href: '/dashboard',
      name: 'Library',
   },
   search: {
      icon: MagnifyingGlass,
      href: '/searchbooks',
      name: 'Search',
   },
   profile: {
      icon: Profile,
      href: '/settings',
      name: 'Profile',
   },
};

export default IconProviders;
