/** @type {import('next').NextConfig} */

const nextConfig = {
   reactStrictMode: true,
   swcMinify: true,
   // pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
   // redirects can be powerful if there are name changes
   // faster way to implement whenever name changes
   // redirect home page when user is logged in?

   // async rewrites() {
   //   return [
   //     {
   //       source: "/profile/:path*",
   //       destination: "/user-settings/:path*",
   //     },
   //   ];
   // },
};

// module.exports = nextConfig;

module.exports = {
   ...nextConfig,
   env: {
      authorUrl: 'https://www.googleapis.com/books/v1/volumes?q=inauthor:',
   },
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'books.google.com',
            pathname: '/content/**',
         },
         {
            protocol: 'https',
            hostname: 'storage.googleapis.com',
            pathname: '/du-prd/**',
         },
         {
            protocol: 'https',
            hostname: 'upload.wikipedia.org',
            pathname: '/wikipedia/**',
         },
      ],
      domains: ['books.google.com', 'upload.wikimedia.org'],
   },
   // issues with Next.js see: https://github.com/mswjs/msw/issues/1801
   webpack: (config, { isServer }) => {
      // Resolve the 'msw' package differently for server and client-side bundles
      if (isServer) {
         // When building the server-side bundle, ignore 'msw/browser'
         config.resolve.alias = {
            ...config.resolve.alias,
            'msw/browser': false,
         };
      } else {
         // When building the client-side bundle, ignore 'msw/node'
         config.resolve.alias = {
            ...config.resolve.alias,
            'msw/node': false,
         };
      }
      return config;
   },
};
