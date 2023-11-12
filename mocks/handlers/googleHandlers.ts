import {
   MAX_REQUESTS,
   TESTING_AUTHOR,
   TESTING_ISBN,
   TESTING_TITLE,
   googleByIdData,
   googleFieldsData,
} from '@/constants/mocks';
import { GoogleDataById, GoogleUpdatedFields } from '@/lib/types/googleBookTypes';
import googleApi from '@/models/_api/fetchGoogleUrl';
import { http, HttpResponse, ResponseResolver, RequestHandler } from 'msw';

export let currentRequestCount = 0;

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
   if (hasGoogleField) {
      return HttpResponse.json<GoogleUpdatedFields>(googleFieldsData);
   }

   // specific isbn
   if (queryParams.has('isbn')) {
      const isbn = queryParams.get('isbn');
      if (isbn && isbn === TESTING_ISBN) {
         return HttpResponse.json(googleByIdData);
      }
   }

   // author-specific queries
   if (queryParams.has('inauthor')) {
      const author = queryParams.get('inauthor');
      if (author && author.includes(TESTING_AUTHOR)) {
         return HttpResponse.json({
            ...googleFieldsData,
            items: googleFieldsData.items.filter((item) =>
               item.volumeInfo.authors.some((a) => a.toLowerCase().includes(author))
            ),
         });
      }
   }

   // general queries
   if (queryParams.has('q')) {
      const query = queryParams.get('q');
      if (query && query.includes(TESTING_TITLE)) {
         return HttpResponse.json(googleFieldsData);
      }
   }

   // Default response for other cases
   return HttpResponse.json({ totalItems: 0, items: [] });
};
