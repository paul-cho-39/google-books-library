// const { Categories, categories } = require('@/constants/categories');

/** {import()} */
/** @type {import('next-sitemap').IConfig} */

const config = {
   siteUrl: process.env.NEXT_PUBLIC_BASE_URL,
   generateRobotsTxt: true,
   generateIndexSitemap: false,
   sitemapSize: 1000,
   // additionalPaths: async (config) => {
   //    const paths = [];

   //    // categories path
   //    categories.forEach((slug) => {
   //       paths.push(config.transform(config, `/categories/${slug}`));
   //    });

   //    // write functions or pass more categories path here

   //    return paths;
   // },
};

module.exports = config;
