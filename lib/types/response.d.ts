// getting the rating data here:
export interface ResponseError {
   code: number;
   message: string;
}

export type MetaDataParams = Omit<ResponseMeta, 'dateTime'>;

export interface ResponseMeta {
   dateTime: string;
   //    status?: 'success' | 'error';
   message?: string;
   options?: unknown;
}

export interface RatingResponseData {
   totalRatings?: number;
   avgRatings?: number;
}
