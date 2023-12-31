export function capitalizeWords(str: string) {
   return str
      .toLocaleLowerCase()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
}

export function transformStrToArray(authors: string) {
   return authors.replace(/\s+with\s+/g, ', ').split(', ');
}

export function formatCategoryName<T extends string>(category: T) {
   return category.toLocaleLowerCase() === 'fiction' ||
      category.toLocaleLowerCase() === 'nonfiction'
      ? `${category} best seller`
      : category;
}
