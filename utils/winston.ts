import { createLogger, format, level, transport, transports } from 'winston';
import path from 'path';
// logs files are not recommended inside the source code
// but for the sake of the project storing logs/

const ERRORS_LOG = path.join(__dirname, 'logs', 'error.log');
const REJECTIONS_LOG = path.join(__dirname, 'logs', 'rejections.log');
const COMBINED_LOG = path.join(__dirname, 'logs', 'combined.log');

const LEVEL = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const logger = createLogger({
   level: LEVEL,
   format: format.combine(
      format.timestamp({
         format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
   ),
   defaultMeta: { service: 'user-service' },
   transports: [
      new transports.File({ filename: ERRORS_LOG, level: 'error' }),
      new transports.File({ filename: COMBINED_LOG }),
   ],
   rejectionHandlers: [new transports.File({ filename: REJECTIONS_LOG })],
});

if (process.env.NODE_ENV !== 'production') {
   logger.add(
      new transports.Console({
         format: format.combine(format.colorize(), format.simple()),
      })
   );
}

export default logger;
