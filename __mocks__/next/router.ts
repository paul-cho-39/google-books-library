import { NextRouter } from 'next/router';

export const useRouter = (): Partial<NextRouter> => {
   return {
      push: jest.fn(),
      query: {},
   };
};
