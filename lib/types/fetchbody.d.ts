import { FilterParams } from '@/models/_api/fetchGoogleUrl';

export type DeleteBody = { id: string; userId: string };
export type FinishedPostBody = ReadPostBody & {
   month: number;
   year: number;
   day: number;
};

export interface ApiRequestOptions<T> {
   apiUrl: string;
   method: Method;
   data?: BodyInit<T>;
   headers?: HeadersInit;
   shouldRoute?: boolean;
   routeTo?: string;
   delay?: number;
}

export type ServerCacheType = {
   source: 'google' | 'nyt';
   endpoint: 'relevant' | 'recent' | 'best-seller';
   category: string;
};

export type ServerSearchParams = 'isbn' | 'title' | 'author';

export type ServerSearchParamType = {
   query: string;
   filters: FilterParams;
   endpoint?: ServerSearchParams;
};

export type CategoryRequestQuery = {
   slug: string;
};

export type SearchRequestQuery = {
   filters: FilterParams;
} & CategoryRequestQuery;

export type Body = ReadPostBody | DeleteBody | FinishedPostBody;
export type Method = 'POST' | 'DELETE' | 'PUT' | 'GET' | 'PATCH';
export type UrlProps = 'reading' | 'finished' | 'want' | 'main';
