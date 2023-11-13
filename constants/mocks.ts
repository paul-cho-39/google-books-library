import { GoogleUpdatedFields, GoogleDataById } from '@/lib/types/googleBookTypes';

export const MAX_REQUESTS = 5;
export const TESTING_ISBN = '999999999';
export const TESTING_TITLE = 'Test Title';
export const TESTING_AUTHOR = 'John Doe';

// there are two types of data that should be returned
// one with updated 'FIELDS' and the other with 'url_by_id'
export const googleFieldsMockData: GoogleUpdatedFields = {
   totalItems: 3,
   items: [
      {
         accessInfo: {
            accessViewStatus: 'NONE',
            embeddable: false,
            country: 'en',
            epub: {
               isAvailable: false,
            },
            pdf: {
               isAvailable: false,
            },
            webReaderLink: '',
            publicDomain: false,
            viewability: 'NO_PAGES',
            quoteSharingAllowed: false,
            textToSpeechPermission: 'ALLOWED_FOR_ACCESSIBILITY',
         },
         id: '456',
         selfLink: '',
         volumeInfo: {
            authors: [TESTING_AUTHOR],
            title: TESTING_TITLE,
            subtitle: '',
            industryIdentifiers: [
               {
                  type: 'ISBN_10',
                  identifier: '123456789',
               },
            ],
         },
      },
      {
         accessInfo: {
            accessViewStatus: 'FULL_PUBLIC_DOMAIN',
            embeddable: false,
            country: 'en',
            epub: {
               // creating a sample for returning
               isAvailable: true,
               acsTokenLink: 'https://epubtestlink.com',
            },
            pdf: {
               isAvailable: false,
            },
            webReaderLink: '',
            publicDomain: false,
            viewability: 'NO_PAGES',
            quoteSharingAllowed: false,
            textToSpeechPermission: 'ALLOWED_FOR_ACCESSIBILITY',
         },
         id: '123',
         selfLink: '',
         volumeInfo: {
            authors: ['Michael K', TESTING_AUTHOR],
            title: 'Sample',
            subtitle: '',
            industryIdentifiers: [
               {
                  type: 'ISBN_10',
                  identifier: '987654321',
               },
            ],
         },
      },
      {
         accessInfo: {
            accessViewStatus: 'SAMPLE',
            embeddable: false,
            country: 'en',
            epub: {
               isAvailable: false,
            },
            pdf: {
               isAvailable: true,
               acsTokenLink: 'https://pdftestlink.com',
            },
            webReaderLink: '',
            publicDomain: false,
            viewability: 'NO_PAGES',
            quoteSharingAllowed: false,
            textToSpeechPermission: 'ALLOWED_FOR_ACCESSIBILITY',
         },
         id: '123',
         selfLink: '',
         volumeInfo: {
            authors: ['Alex S'],
            title: 'Mix',
            subtitle: '',
            industryIdentifiers: [
               {
                  type: 'ISBN_10',
                  identifier: '999999999',
               },
            ],
         },
      },
   ],
};

export const googleByIdMockData: GoogleDataById = {
   accessInfo: {},
   etag: 'abc123',
   id: '123',
   selfLink: '',
   kind: '',
   layerInfo: {},
   saleInfo: {},
   volumeInfo: {
      authors: ['John Doe'],
      title: 'Test Title',
      subtitle: '',
   },
};
