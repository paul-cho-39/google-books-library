import { http, HttpResponse, ResponseResolver, RequestHandler, PathParams } from 'msw';
import { authorUrl, filteredUrl, googleHandlers, isbnUrl } from './googleHandlers';

export const handlers = [
   http.get(filteredUrl, googleHandlers),
   http.get(authorUrl, googleHandlers),
   http.get(isbnUrl, googleHandlers),
];
