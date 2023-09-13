import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import RefreshTokenHandler from '../lib/auth/refreshTokenHandler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Container from '../components/layout/container';
import { ColorTheme } from '../lib/types/theme';
import ThemeProvider from '../lib/context/ThemeContext';
import Navigation from '../components/headers';
import HomeLayout from '../components/layout/page/home';

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         // if in production mode may have to turn this on?
         refetchOnWindowFocus: false,
         refetchOnReconnect: true,
         refetchOnMount: false,
      },
   },
});
// TODO // add layout and header here
// also is there a way to return unauthenticated users here?

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
