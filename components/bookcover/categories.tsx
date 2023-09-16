import Link from 'next/link';
import { breakCategories } from '../../lib/helper/books/editBookPageHelper';

interface CategoriesProps {
   categories?: string[];
   hasLink?: boolean;
   className?: string;
}

const Categories = ({ categories, hasLink = false, className }: CategoriesProps) => {
   const filteredCategories = breakCategories(categories);

   if (!filteredCategories) return <></>;
   return (
      <ul role='list' className='flex flex-row flex-wrap '>
         {filteredCategories.map((category, index) => (
            <li className={className} key={index}>
               {hasLink ? (
                  <Link passHref href={'/categories/[slug]'} as={`/categories/${category}`}>
                     <a>{category}</a>
                  </Link>
               ) : (
                  category
               )}
            </li>
         ))}
      </ul>
   );
};

export default Categories;
