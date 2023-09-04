import { ClientSafeProvider } from "next-auth/react";

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
};
