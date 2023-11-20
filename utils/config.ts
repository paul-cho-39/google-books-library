export const baseURL =
   process.env.NEXTAUTH_URL || (typeof window !== 'undefined' && window.location.origin);
