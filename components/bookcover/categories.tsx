import Link from 'next/link';
import { breakCategories } from '@/lib/helper/books/editBookPageHelper';
import classNames from 'classnames';
import ROUTES from '@/utils/routes';

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
            <li className={classNames(className, 'mr-1')} key={index}>
               {hasLink ? (
                  <Link passHref href={'/categories/[slug]'} as={ROUTES.CATEGORIES(category)}>
                     <a>
                        {category}
                        <span>{filteredCategories.length - 1 > index ? ', ' : ''}</span>
                     </a>
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
