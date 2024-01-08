import 'next-auth';

declare module 'next-auth' {
   /**
    * extending session type to contain isCredentials
    */
   interface Session {
      isCredential?: boolean;
   }
}
