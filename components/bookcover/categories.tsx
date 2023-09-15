import { breakCategories } from '../../lib/helper/books/editBookPageHelper';

const Categories = ({ categories }: { categories?: string[] }) => {
   const filteredCategories = breakCategories(categories);

   if (!filteredCategories) return <></>;
   return (
      <ul role='listitem' className='flex flex-row flex-wrap '>
         {/* <span className='font-semibold '>{!filteredCategories ? '' : 'Genres: '} </span> */}
         {filteredCategories &&
            filteredCategories.map((category, index) => (
               <li
                  className='text-md underline underline-offset-4 decoration-orange-600 dark:decoration-orange-300'
                  key={index}
               >
                  {category}
               </li>
            ))}
      </ul>
   );
};

export default Categories;
