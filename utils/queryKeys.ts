import { MetaProps } from '../models/_api/fetchGoogleUrl';
import { CategoryQualifiers, ReviewQualifiers } from '../models/_api/fetchNytUrl';

type NytDataType = CategoryQualifiers['type'];
type ReviewType = keyof ReviewQualifiers;

const queryKeys = {
   books: ['books'] as const,
   bookLibrary: ['booklibrary'] as const,
   deleted: ['deleted'] as const,
   primary: ['booklibrary', 'primary'] as const,
   want: ['booklibrary', 'reading'] as const,
   currentlyReading: ['bookLibrary', 'currentlyReading'] as const,
   finished: ['booklibrary', 'finished'] as const,
   allGoogleCategories: ['google', 'categories'] as const,
   ratings: ['ratings', 'all'] as const,
   ratingsByBook: (bookId: string) => ['ratings', { id: bookId }] as const,
   categories: (category: string | string[], meta?: MetaProps) =>
      ['category', { type: category }, meta] as const,
   nytReview: (key: ReviewType, value: string) => [key, { value }] as const,
   nytBestSellers: (type: NytDataType | string, date: string | 'current') =>
      ['bestSellers', { type: type }, { date: date }] as const,
   singleBook: (bookId: string) => ['singebook', { bookId }],
   bookSearch: (search: string) => [...queryKeys.books, { search }] as const,
   userId: (id: string) => [...queryKeys.books, { id: id }] as const,
   userLibrary: (userId: string) => [...queryKeys.bookLibrary, { userId }] as const,
};

export default queryKeys;
