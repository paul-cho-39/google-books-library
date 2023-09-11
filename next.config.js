/** @type {import('next').NextConfig} */

const nextConfig = {
   reactStrictMode: true,
   swcMinify: true,
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

module.exports = nextConfig;

module.exports = {
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
};
