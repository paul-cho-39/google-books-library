import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
   // TEST ONLY
   // retry should be turned off
   const queryClient = new QueryClient({
      defaultOptions: {
         queries: {
            // if in production mode may have to turn this on?
            retry: false,
            cacheTime: Infinity,
         },
      },
      logger: {
         log: console.log,
         warn: console.warn,
         error: process.env.NODE_ENV === 'test' ? () => {} : console.error,
      },
   });

   // eslint-disable-next-line react/display-name
   return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
   );
};

export default createWrapper;
