// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
   dsn: 'https://4e69afff431f8e8f86f6aaf82e2c66fd@o4506249124052992.ingest.sentry.io/4506249127067648',

   // Adjust this value in production, or use tracesSampler for greater control
   tracesSampleRate: 1,

   // Setting this option to true will print useful information to the console while you're setting up Sentry.
   debug: false,
});
