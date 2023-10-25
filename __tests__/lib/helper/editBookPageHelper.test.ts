import '@testing-library/jest-dom';

import { breakCategories, removeHtmlTags } from '@/lib/helper/books/editBookPageHelper';

describe('removeHtmlTags', () => {
   it('removes HTML tags from the description', () => {
      const description = '<p>This is a <strong>test</strong> description.</p>';
      const result = removeHtmlTags(description);
      expect(result).toEqual(['This is a test description.']);
   });

   it('splits the description on double break tags', () => {
      const description =
         '<p>This is a test description.</p><br><br><strong>Another test inside the tags.</strong>';
      const result = removeHtmlTags(description);
      expect(result).toEqual(['This is a test description.', 'Another test inside the tags.']);
   });

   it('returns undefined if the description is not provided', () => {
      const result = removeHtmlTags(undefined);
      expect(result).toBeUndefined();
   });
});

describe('breakCategories', () => {
   it('should break categories correctly and remove duplicates', () => {
      const categories = ['Fiction / Mystery', 'Adventure', 'Sci-fi, Drama', 'Mystery'];
      const result = breakCategories(categories);

      // Expected broken categories without duplicates
      const expected = ['Fiction', 'Mystery', 'Adventure', 'Sci-fi', 'Drama'];

      expect(result).toEqual(expected);
   });

   it('should handle categories with multiple separators correctly', () => {
      const categories = ['Action / Thriller, Mystery', 'Adventure / Fantasy'];
      const result = breakCategories(categories);

      // Expected broken categories
      const expected = ['Action', 'Thriller', 'Mystery', 'Adventure', 'Fantasy'];

      expect(result).toEqual(expected);
   });

   it('should return undefined for undefined categories', () => {
      const result = breakCategories(undefined);
      expect(result).toBeUndefined();
   });
});
