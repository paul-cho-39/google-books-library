import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../styles/globals.css';

import ThemeProvider from '@/lib/context/ThemeContext';

import Navigation from '@/components/headers';
import HomeLayout from '@/components/layout/page/home';
import SearchFilterProvider from '@/lib/context/SearchFilterContext';

// progress loader at the top of the page
NProgress.configure({
   minimum: 0.3,
   easing: 'ease',
   speed: 800,
   showSpinner: false,
});

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         // if in production mode may have to turn this on?
         refetchOnWindowFocus: false,
         refetchOnReconnect: true,
         refetchOnMount: false,
      },
   },
});

function MyApp({ Component, pageProps }) {
   // the default is to have the sidebar open when application starts
   const [isSidebarOpen, setSidebarOpen] = useState(true);

   // mocking servers
   // useEffect(() => {
   //    if (process.env.NODE_ENV === 'development') {
   //       import('mocks').then(({ deferMock }) => deferMock());
   //    } else
   //       import('mocks/server').then(({ server }) => {
   //          server.listen();
   //       });
   // }, []);

   return (
      <QueryClientProvider client={queryClient}>
         <ThemeProvider>
            <SessionProvider session={pageProps.session}>
               <SearchFilterProvider>
                  <Navigation sidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
                  {/* <SideBarPortal sidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
                  <HomeLayout isOpen={isSidebarOpen}>
                     <Component {...pageProps} />
                  </HomeLayout>
               </SearchFilterProvider>
               <ReactQueryDevtools initialIsOpen={true} />
            </SessionProvider>
         </ThemeProvider>
      </QueryClientProvider>
   );
}

export default MyApp;
