import { NextRequest, NextResponse } from 'next/server';
import logger from '../../utils/winston';

const requestLogger = (req: NextRequest, res: NextResponse) => {
   logger.info('Request receieved', {
      method: req.method,
      path: req.nextUrl.pathname,
      url: req.url,
      status: res.status,
   });
};

const logError = () => {
   logger.error('');
};
