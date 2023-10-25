import Router from 'next/router';
import React, { useState } from 'react';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NProgress from 'nprogress';

import 'nprogress/nprogress.css';
import '../styles/globals.css';

import ThemeProvider from '@/lib/context/ThemeContext';
import RefreshTokenHandler from '@/lib/auth/refreshTokenHandler';

import Navigation from '@/components/headers';
import HomeLayout from '@/components/layout/page/home';

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
   // adjusting proper time as it refreshes the refreshtoken
   // may be expired { PROVIDE URL HERE }
   const [interval, setInterval] = useState(0);
   const [isSidebarOpen, setSidebarOpen] = useState(false);
   // set isSidebarOpen here and if it is open then the layout is shrunk

   return (
      <QueryClientProvider client={queryClient}>
         <ThemeProvider>
            <SessionProvider session={pageProps.session} refetchInterval={interval}>
               <Navigation sidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
               <HomeLayout isOpen={isSidebarOpen}>
                  <Component {...pageProps} />
               </HomeLayout>
               <RefreshTokenHandler setInterval={setInterval} />
               <ReactQueryDevtools initialIsOpen={true} />
            </SessionProvider>
         </ThemeProvider>
      </QueryClientProvider>
   );
}

export default MyApp;
