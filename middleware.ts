import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
   // return early if url isn't supposed to be protected
   if (!req.url.includes('/protected-url')) {
      return NextResponse.next();
   }

   // loggers not running inside. Suspecting when middleware is some packages
   // in nodejs are not running(?)
   // logger.info('Request recieved', {
   //    method: req.method,
   //    path: req.nextUrl.pathname,
   //    url: req.url,
   // });

   return NextResponse.next();
}
