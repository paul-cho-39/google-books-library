import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import RefreshTokenHandler from '../lib/auth/refreshTokenHandler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Container from '../components/layout/container';
import MobileNavigation from '../components/headers/mobile/mobileHeader';
import { ColorTheme } from '../lib/types/theme';
import ThemeProvider from '../lib/context/ThemeContext';

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

   return (
      <QueryClientProvider client={queryClient}>
         <ThemeProvider>
            <SessionProvider session={pageProps.session} refetchInterval={interval}>
               <MobileNavigation />
               <Container>
                  <Component {...pageProps} />
               </Container>
               <RefreshTokenHandler setInterval={setInterval} />
               <ReactQueryDevtools initialIsOpen={true} />
            </SessionProvider>
         </ThemeProvider>
      </QueryClientProvider>
   );
}

export default MyApp;
