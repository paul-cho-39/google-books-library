import { GoogleUpdatedFields, IndustryIdentifiers, Items } from '../../types/googleBookTypes';
import { Data } from '../../types/models/books';

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

export const getBodyFromFilteredGoogleFields = (data: Items<any>): Data => {
   const volumeInfo = data.volumeInfo;
   return {
      title: volumeInfo.title,
      subtitle: volumeInfo?.subtitle || '',
      publishedDate: volumeInfo?.publishedDate || '',
      language: volumeInfo?.language || '',
      pageCount: volumeInfo?.pageCount || 0,
      categories: volumeInfo?.categories || [],
      authors: volumeInfo?.authors || [],
      industryIdentifiers: volumeInfo?.industryIdentifiers as unknown as string[],
   };
};

export type ReadPostBody = ReturnType<typeof getBody>;
