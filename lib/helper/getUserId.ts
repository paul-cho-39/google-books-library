import { Session } from 'next-auth';

/**
 *
 * @param user
 * @returns {Object} userInfo
 */
export default function getUserInfo(user: Session | null) {
   const userInSession = !!user;
   const userId = user && getUserKey(user as object, 'id');
   const isCredential = user && !user.isCredential ? false : true;
   const name = user && getUserKey(user as object, 'name');

   const userInfo = {
      userId,
      userInSession,
      name,
      isCredential,
   };

   return userInfo;
}

/**
 * @description Retrieves user state in a nested object
 * @param userObject
 * @param keyToFind
 * @returns
 */
export function getUserKey<T extends object>(userObject: T, keyToFind: string): string {
   const user =
      userObject &&
      Object.entries(userObject).reduce(
         (acc, [key, value]) =>
            key === keyToFind
               ? acc.concat(value)
               : typeof value === 'object'
               ? acc.concat(getUserKey(value, keyToFind) as unknown as [])
               : acc,
         []
      );
   return getUser(user);
}

function getUser(user: string[]) {
   return user && user[0]?.toString();
}

export const getUserIdAvoidTs = (userInfo: any) => {
   const { user } = userInfo;
   return user;
};
