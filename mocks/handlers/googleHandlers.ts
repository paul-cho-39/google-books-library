import {
   MAX_REQUESTS,
   TESTING_AUTHOR,
   TESTING_ISBN,
   TESTING_TITLE,
   googleByIdMockData,
   googleFieldsMockData,
} from '@/constants/mocks';
import { GoogleDataById, GoogleUpdatedFields, Items } from '@/lib/types/googleBookTypes';
import googleApi from '@/models/_api/fetchGoogleUrl';
import { http, HttpResponse, ResponseResolver, RequestHandler } from 'msw';

export let currentRequestCount = 0;

// provide this in a different file?
// can this be mapped?
export const filteredUrl = googleApi.getUrlByQuery('Test');
export const authorUrl = googleApi.getUrlByAuthor('Michael');
export const isbnUrl = googleApi.getUrlByIsbn('999999999');

// TODO: there should be response for other filtered search params
const handleRateLimiting = (): Response | null => {
   if (currentRequestCount > MAX_REQUESTS) {
      return new Response(JSON.stringify({ message: 'Too many requests' }), {
         status: 429,
         headers: {
            'Content-Type': 'application/json',
         },
      });
   }

   return null;
};

const filterByIsbn = (data: GoogleUpdatedFields, isbn: string) => {
   return {
      ...data,
      items: data.items.filter((item) => {
         const identifiers = item.volumeInfo.industryIdentifiers!;
         identifiers.some(
            (identifier) => identifier.type === 'ISBN_10' && identifier.identifier === isbn
         );
      }),
   };
};

export const googleHandlers = async ({ request }) => {
   const url = new URL(request.url);

   const KEY = process.env.NEXT_PUBLIC_GOOGLE_KEY || '';

   const queryParams = url.searchParams;
   const hasGoogleField = url.searchParams.get(KEY); // even if there is no key it will still call the api

   currentRequestCount++;

   // when the user reaches the rateLimit
   const rateLimitResponse = handleRateLimiting();
   if (rateLimitResponse) return rateLimitResponse;

   // when page is refreshed
   if (!hasGoogleField) {
      // the isbn does not have the key appended either
      if (queryParams.get('isbn')) {
         const items = filterByIsbn(googleFieldsMockData, TESTING_ISBN);
         return HttpResponse.json<GoogleUpdatedFields>(items);
      }
      return HttpResponse.json<GoogleDataById>(googleByIdMockData);
   }

   // author-specific queries
   if (queryParams.has('inauthor')) {
      const author = queryParams.get('inauthor');
      if (author && author.includes(TESTING_AUTHOR)) {
         return HttpResponse.json({
            ...googleFieldsMockData,
            items: googleFieldsMockData.items.filter((item: Items<any>) =>
               item.volumeInfo.authors.some((a) => a.toLowerCase().includes(author))
            ),
         });
      }
   }

   // general queries
   if (queryParams.has('q')) {
      const query = queryParams.get('q');
      if (query && query.includes(TESTING_TITLE)) {
         return HttpResponse.json(googleFieldsMockData);
      }
   }

   // Default response for other cases
   return HttpResponse.json({ totalItems: 0, items: [] });
};
