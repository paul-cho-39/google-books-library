import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { JWT } from 'next-auth/jwt';

// TODO // have to set time to an appropriate time
// 2) google provider refresh token
// the refresh token should only be provided once
// thus useful to use google since it only requires when the user first signs in
export const authOptions: NextAuthOptions = {
   adapter: PrismaAdapter(prisma),
   secret: process.env.NEXTAUTH_SECRET,
   pages: {
      signIn: '/auth/signin',
      // signOut: "/auth/signout",
      newUser: `${process.env.NEXTAUTH_URL}`,
      error: '/auth/signin',
   },
   session: {
      strategy: 'database' && 'jwt',
      // should be 60 secs
      maxAge: 1000 * 60 * 60,
   },
   // set this in the environment
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         // scope:
         //   "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/spreadsheets.readonly",
         authorizationUrl:
            'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
         accessTokenUrl: 'https://oauth2.googleapis.com/token',
      } as any),
      FacebookProvider({
         clientId: process.env.FACEBOOK_CLIENT_ID as string,
         clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      }),
      CredentialsProvider({
         id: 'credentials',
         name: 'credentials',
         credentials: {
            email: { label: 'Email', type: 'text', placeholder: 'Email' },
            password: { label: 'Password', type: 'password' },
         },
         authorize: async (credentials, req) => {
            try {
               const res = await fetch(
                  `${process.env.NEXTAUTH_URL}/api/user/authenticatecredential`,
                  {
                     method: 'POST',
                     headers: {
                        'Content-Type': 'application/json',
                        accept: 'application/x-www-form-urlencoded',
                     },
                     body: JSON.stringify(credentials),
                  }
               );
               // update errors here
               const user = await res.json();
               if (res.ok && user.accessToken) {
                  return user;
               } else {
                  return null;
               }
            } catch (error) {
               throw new Error(error + `${credentials?.email}`);
            }
         },
      }),
   ],
   // for session callback where the credentials are part of session?
   callbacks: {
      // refresh token once session maxAge expires
      async jwt({ token, user, account }) {
         if (user && account) {
            token.user = user;
            // token.cookies = user.cookies;
            // if (account.provider === "google") {
            // const token = googleRefreshAccessToken(account as typeof account);
            // console.log("account profile", account);
            // console.log("google TOKEN: ", token);
            // if (account?.expires_at && Date.now() < account?.expires_at) {
            //   return account.access_token;
            // }

            // return Promise.resolve(token);
            // }
            // assigning refreshtoken for credentials

            // no google -- fb?
            if (!account.id_token) {
               token.accessToken = user.accessToken;
               token.refreshToken = user.refreshToken;
               console.log('Is google provider still working?', user);
               // when the token should be refreshed
               const shouldRefreshTime = Math.round(
                  (token.exp as number) - 60 * 60 * 1000 - Date.now()
               );
               if (shouldRefreshTime > 0) {
                  return Promise.resolve(token);
               }
               const refreshedToken = refreshToken(token);
               return refreshedToken;
            }
         }
         return Promise.resolve(token);
      },
      async session({ session, user, token }) {
         session.user = token.user;
         session.error = token?.error;
         // console.log("token user is: ", token);
         // console.log("session user is: ", user);
         // console.log("the session is: ", session);
         // defining user here is not good since it will reveal the password

         return Promise.resolve(session);
      },
   },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export default authHandler;

// refreshing token
async function refreshToken(token: JWT) {
   let url = `${process.env.NEXTAUTH_URL}/api/auth/refreshtoken`;
   const body = { token };
   // 2 mins
   const exp = Math.floor(Date.now() / 1000) + 60 * 60;

   try {
      const res = await fetch(url, {
         method: 'POST',
         credentials: 'include',
         headers: {
            'Content-Type': 'application/json',
            accept: 'application/x-www-form-urlencoded',
         },
         body: JSON.stringify(body),
      });
      const refreshedUserToken = await res.json();

      if (refreshedUserToken) {
         const expires = token?.exp as number;
         return {
            ...token,
            accessToken: refreshedUserToken.accessToken,
            accessTokenExpires: expires && (Date.now() + expires) * 1000,
            refreshToken: refreshedUserToken.refreshToken,
         };
      }
   } catch (e) {
      console.error(e);
      return {
         ...token,
         error: 'RefreshAccessTokenError',
      };
   }
}

// facebook does not work the default should for fb should be six months
async function googleRefreshAccessToken(account: any) {
   try {
      const url =
         'https://oauth2.googleapis.com/token?' +
         new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID as string,
            client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
            grant_type: 'refresh_token',
            refresh_token: account.refresh_token as string,
         });
      const response = await fetch(url as string, {
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
         },
         method: 'POST',
      });

      const refreshedTokens = await response.json();
      console.log('refreshedTokens for Google Provider: ', refreshedTokens);

      if (!response.ok) {
         throw refreshedTokens;
      }

      // update prisma adapter and session
      if (response.ok && refreshedTokens) {
         const accounts = await prisma.account.findFirst({
            where: { providerAccountId: account.providerAccountId },
            select: { expires_at: true, id: true },
         });
         const expires = new Date(Date.now() + accounts?.expires_at * 1000);
         await prisma.account.update({
            where: { id: accounts?.id },
            data: {
               refresh_token: refreshedTokens.refresh_token ?? account.refreshToken,
               access_token: refreshedTokens.accessToken,
               expires_at: Number(expires),
            },
         });
      }
   } catch (error) {
      console.log(error);

      return {
         ...account,
         error: 'RefreshAccessTokenError',
      };
   }
}

// Still to do for authentication
// 1) create refreshToken for google and facebook
// if signIn they MUST logout to signin to different account
// so if signed in they cannot sign would call this in signIn
// callback where if (session) { signIn = false; }

// 2) and in the client side change the signIn page so that when
// the user is signed in (although NextAuth should take care most
// of this problem)

// 3) signIn -> .then() so that error will be displayed at the top
// 3b) fix the sign in design

// 4) understand how time can vary which will invalidate the refreshtoken
// by whatever the error margin is which wont allow users to verify

// 5) find out how to reset the password

// 6) possibly look more into CRM for having an admin page and if required
// making a separate admin page and adding ROLES should be implemented

// look this up
