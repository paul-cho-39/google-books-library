import { GoogleUpdatedFields } from '@/lib/types/googleBookTypes';
import googleApi from '@/models/_api/fetchGoogleUrl';
import { http, HttpResponse, ResponseResolver, RequestHandler, PathParams } from 'msw';

// provide this in a different file?
// can this be mapped?
const filteredUrl = googleApi.getUrlByQuery('Test');
const authorUrl = googleApi.getUrlByAuthor('Michael');
const isbnUrl = googleApi.getUrlByIsbn('999999999');

export const handlers = [];
