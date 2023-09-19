export const routes = {
   home: 'home',
   search: 'search',
   category: 'category',
} as const;

export type RouteParams = (typeof routes)[keyof typeof routes];
