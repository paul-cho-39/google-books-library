import { PrismaClient } from '@prisma/client';
import logger from '../utils/winston';

let prisma: PrismaClient;

declare global {
   var prisma: PrismaClient | undefined;
}

if (typeof window === 'undefined') {
   if (process.env.NODE_ENV === 'production') {
      prisma = new PrismaClient();
   } else {
      let globalWithPrisma = global as typeof globalThis & {
         prisma: PrismaClient;
      };
      if (!globalWithPrisma.prisma) {
         globalWithPrisma.prisma = new PrismaClient({
            log: ['warn', 'error'],
         });
      }
      prisma = globalWithPrisma.prisma;
   }
}

// middleware for logging inside /logs file whenever prisma query is executed
prisma!.$use(async (params, next) => {
   const startTime = Date.now();

   try {
      const result = await next(params);

      const endTime = Date.now();
      logger.info('Prisma query executed', {
         model: params.model,
         action: params.action,
         params: params.args,
         elapsedMs: endTime - startTime,
      });

      return result;
   } catch (error) {
      const endTime = Date.now();
      logger.error('Prisma query error', {
         model: params.model,
         action: params.action,
         params: params.args,
         elapsedMs: endTime - startTime,
         errorMessage: error,
      });

      throw error;
   }
});

export default prisma!;
