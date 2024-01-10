import { NextApiRequest, NextApiResponse } from 'next';
import { MetaDataParams, ResponseErrorParams } from '@/lib/types/response';
import winston from 'winston/lib/winston/config';
import { errorLogger, internalServerErrorLogger } from '../winston';

export default function createApiResponse<T>(
   data: T extends T ? T : null,
   meta?: MetaDataParams,
   error?: ResponseErrorParams,
   req?: NextApiRequest
) {
   if (error && req) {
      logError(error, req);
   }

   let finalError: ResponseErrorParams | undefined;

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

function logError(error: ResponseErrorParams, req: NextApiRequest) {
   error.code === 500 ? internalServerErrorLogger(req) : errorLogger(error, req);
}
