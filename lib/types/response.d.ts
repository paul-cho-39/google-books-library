import BookService from '@/models/server/service/BookService';

// for creating apiResponseError that will return 'ErrorResponse'
export interface ResponseErrorParams {
   code: number;
   message?: string;
}

export interface MetaDataParams {
   dateTime?: string;
   message?: string;
   options?: unknown;
}
// json payload when it runs into an error
interface ErrorResponse {
   data: null;
   meta?: MetaDataParams;
   success: boolean;
   error: ResponseError | undefined;
}

interface GetApiResponse<TData> {
   data: TData;
   meta: MetaDataParams;
   success: boolean;
   // Other fields specific to GET responses
}

interface PostApiResponse<TData> {
   data: TData;
   meta: MetaDataParams;
   success: boolean;
   // Other fields specific to POST responses
}

// specifying data response when 'GET' and 'POST'
type MethodSpecificApiResponse<TMethod extends 'GET' | 'POST', TData> = TMethod extends 'GET'
   ? GetApiResponse<TData>
   : TMethod extends 'POST'
   ? PostApiResponse<TData>
   : never;

type CustomApiResponse<TMethod extends 'GET' | 'POST', TData> = TData extends Error
   ? ErrorResponse
   : MethodSpecificApiResponse<TMethod, TData>;

export interface RatingResponseData {
   totalRatings?: number;
   avgRatings?: number;
}

type GetResponseData<TData> = Awaited<ReturnType<TData>>;

export interface UserIdAndBookIdQuery {
   id: string;
   slug: string;
}

// the parentId is equal to the index
export interface ReplyCommentRequestQuery extends UserIdAndBookIdQuery {
   index: string;
}

export interface CommentsRequestQuery extends UserIdAndBookIdQuery {
   page: string;
}
