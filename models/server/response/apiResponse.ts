import { NextApiRequest, NextApiResponse } from 'next';
import { MetaDataParams, ResponseError, ResponseMeta } from '@/lib/types/response';
import winston from 'winston/lib/winston/config';
import { errorLogger, internalServerErrorLogger } from '../winston';

export default function createApiResponse<T>(
   data: T | null,
   meta?: MetaDataParams,
   error?: ResponseError,
   req?: NextApiRequest
) {
   if (error && req) {
      logError(error, req);
   }

   let finalError: ResponseError | undefined;

   if (error) {
      if (error.code === 500) {
         finalError = {
            ...error,
            message: error.message || 'Internal server error',
         };
      } else {
         finalError = error;
      }
   }

   return {
      data,
      meta: {
         dateTime: new Date().toISOString(),
         ...meta,
      },
      success: !error,
      error: finalError,
   };
}

function logError(error: ResponseError, req: NextApiRequest) {
   error.code === 500 ? internalServerErrorLogger(req) : errorLogger(error, req);
}
