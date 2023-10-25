import '@testing-library/jest-dom';

import { removeHtmlTags } from '@/lib/helper/books/editBookPageHelper';

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
