import { NextApiRequest, NextApiResponse } from 'next';
import { MetaDataParams, ResponseError, ResponseMeta } from '../../../lib/types/response';
import winston from 'winston/lib/winston/config';
import { errorLogger, internalServerErrorLogger } from '../winston';

// creating more maintainable structure if continuing
export default class ApiResponseBase<T> {
   data: T | null;
   meta: ResponseMeta;
   success: boolean | null;
   error?: ResponseError;
   constructor(data: T | null, error?: ResponseError, meta?: MetaDataParams) {
      this.data = data;
      this.meta = {
         dateTime: new Date().toISOString(),
         ...meta,
      };
      this.success = !error;
      if (error) {
         this.setError(error);
      }
   }
   setLogError(error: ResponseError, req: NextApiRequest) {
      error.code === 500 ? internalServerErrorLogger(req) : errorLogger(error, req);
      this.error = error;
   }
   toJson() {
      const { data, meta, success, error } = this;
      return {
         data: data,
         metaInfo: meta,
         success: success,
         error,
      };
   }
   private setError(error: ResponseError) {
      this.error = error;
   }
}
