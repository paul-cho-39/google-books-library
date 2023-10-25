import logger from '@/utils/winston';
import { NextApiResponse, NextApiRequest } from 'next';

const requestLogger = (req: NextApiRequest, res: NextApiResponse) => {
   logger.info('Request receieved', {
      method: req.method,
      url: req.url,
      status: res.status,
   });
};

const errorLogger = (error: unknown, req: NextApiRequest) => {
   logger.error('Error receieved', {
      errorMessage: error,
      method: req.method,
      path: req.url,
   });
};

const internalServerErrorLogger = (req: NextApiRequest) => {
   logger.error('Internal Server Error', {
      method: req.method,
      path: req.url,
      description: 'Unhandled error or unknown error occurred',
   });
};

export { requestLogger, errorLogger, internalServerErrorLogger };
