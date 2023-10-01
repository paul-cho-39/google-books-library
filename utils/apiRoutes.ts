import { UrlProps } from '../lib/types/fetchbody';

type CacheType = {
   source: 'google' | 'nyt';
   endpoint: 'relevant' | 'recent' | 'best-seller';
   category: string;
};

const BASE_PATH = '/api';
const DOMAIN_BOOKS = 'books';
const DOMAIN_THIRD_PARTY = 'third-party';
const DOMAIN_USER = 'user';
const DOMAIN_USER_SETTINGS = 'user-settings';
const DOMAIN_VERIFY = 'verify';
const DOMAIN_RATING = 'rating';

const API_ROUTES = {
   BOOKS: {
      path: (userId: string, subdomain: UrlProps) =>
         `${BASE_PATH}/${DOMAIN_BOOKS}/${userId}/${subdomain}`,
   },
   // DEPRECATED
   THIRD_PARTY: {
      path: (pathTypes: CacheType) => {
         const { source, endpoint, category } = pathTypes;
         return `${BASE_PATH}/${DOMAIN_THIRD_PARTY}/${source}/${category}/${endpoint}`;
      },
   },
   USERS: {
      AUTHENTICATE: `${BASE_PATH}/${DOMAIN_USER}/authenticate-credential`,
      DELETE: `${BASE_PATH}/${DOMAIN_USER}/delete-account`,
      SIGNUP: `${BASE_PATH}/${DOMAIN_USER}/signup`,
   },

   SETTING: {
      CHANGE_PASSWORD: `${BASE_PATH}/${DOMAIN_USER_SETTINGS}/change-password`,
      CHANGE_NAME: `${BASE_PATH}/${DOMAIN_USER_SETTINGS}/names`,
   },
   VERIFY: {
      RESET_EMAIL: (userId: string, token: string) =>
         `${BASE_PATH}/${DOMAIN_VERIFY}/${userId}/${token}`,
      SEND_VERIFICATION: `${BASE_PATH}/${DOMAIN_VERIFY}`,
   },
   RATING: {
      BATCH: `${BASE_PATH}/${DOMAIN_RATING}/batch-categories`,
      RATE_BOOK: (id: string) => `${BASE_PATH}/${DOMAIN_RATING}/${id}/`,
   },
};

export default API_ROUTES;
