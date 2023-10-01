import { Items } from '../../types/googleBookTypes';

export const getBody = (userId: string, book: Items<any>) => {
   const { id, volumeInfo } = book;

   const { industryIdentifiers, authors, categories, ...rest } = volumeInfo;
   const body = {
      userId,
      id,
      industryIdentifiers,
      authors,
      categories,
      ...rest,
   };

   return body;
};

export type ReadPostBody = ReturnType<typeof getBody>;
