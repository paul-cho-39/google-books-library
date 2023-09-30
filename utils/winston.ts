import { createLogger, format, level, transports } from 'winston';
import path from 'path';
// logs files are not recommended inside the source code
// but for the sake of the project storing logs/

const ERRORS_LOG = path.join(__dirname, 'logs', 'error.log');
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
   defaultMeta: { service: 'user-service' }, // Optional: You can define a service name for the logger
   transports: [
      new transports.File({ filename: ERRORS_LOG, level: 'error' }),
      new transports.File({ filename: COMBINED_LOG }),
   ],
});

if (process.env.NODE_ENV !== 'production') {
   logger.add(
      new transports.Console({
         format: format.combine(format.colorize(), format.simple()),
      })
   );
}

export default logger;
