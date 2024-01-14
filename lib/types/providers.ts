import { ClientSafeProvider } from 'next-auth/react';

export interface StyleLogo {
   Provider: any;
   ProviderDark?: any;
   text: string;
   textDark?: string;
   bg: string;
   bgDark?: string;
}

export type Providers = {
   providers:
      | ClientSafeProvider
      | {
           id: string;
           name: string;
        }
      | undefined;
   callbackUrl: string;
};

export type Users = {
   username: string | null;
   email: string | null;
};

export type UserInfo = {
   userId: string | null;
   userInSession: boolean;
   name: string | null;
   isCredential: boolean;
   photoUrl?: string | null;
};
