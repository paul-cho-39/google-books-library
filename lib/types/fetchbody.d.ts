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

export type Body = ReadPostBody | DeleteBody | FinishedPostBody;
export type Method = 'POST' | 'DELETE' | 'PUT' | 'GET' | 'PATCH';
export type UrlProps = 'reading' | 'finished' | 'want' | 'primary';
