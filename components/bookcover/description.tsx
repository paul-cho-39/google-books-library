import { useState } from 'react';
import { removeHtmlTags, sliceDescription } from '@/lib/helper/books/editBookPageHelper';
import { ArrowDownIcon, ArrowUpIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import Link, { LinkProps } from 'next/link';
import classNames from 'classnames';
import clsx from 'clsx';

export type LineClamp =
   | 'line-clamp-1'
   | 'line-clamp-2'
   | 'line-clamp-3'
   | 'line-clamp-4'
   | 'line-clamp-5'
   | 'line-clamp-6';

type TextSize = 'text-xs' | 'text-sm' | 'text-md' | 'text-lg' | 'text-xl'; // add more if needed

interface DescriptionProps extends LinkProps {
   description: string | undefined;
   descriptionLimit?: number;
   isLink?: boolean;
   lineClamp?: LineClamp;
   textSize?: TextSize;
   className?: string;
}

const BookDescription = ({
   description,
   descriptionLimit = 200,
   isLink = false,
   lineClamp = 'line-clamp-3',
   textSize = 'text-sm',
   className,
   ...props
}: DescriptionProps) => {
   const [toggleDescription, setToggleDescription] = useState(false);

   const filteredDescription = removeHtmlTags(description);
   const displayedDescription = sliceDescription(filteredDescription, descriptionLimit);
   const minimumDescriptionChar = filteredDescription?.toString().length;

   // if there isnt any description
   const isDescriptionEmpty = !filteredDescription || !displayedDescription;

   const SeeMoreElement = isLink ? (
      <Link {...props}>
         <a
            data-testid='visible-link'
            aria-label='See more about this book'
            className='flex items-center justify-end px-2 hover:translate-x-1 hover:text-slate-300 transition-all duration-200'
         >
            <span className='text-blue-500 text-xs'>See More</span>{' '}
            <ArrowRightIcon color='rgb(59, 130, 246)' height='10' width='10' />{' '}
         </a>
      </Link>
   ) : (
      <button
         aria-expanded={toggleDescription}
         role='button'
         onClick={() => setToggleDescription(true)}
         className={`${
            //
            minimumDescriptionChar && minimumDescriptionChar < descriptionLimit
               ? 'hidden'
               : 'inline-flex font-semibold mt-2.5 transition-opacity dark:text-slate-200 duration-100 hover:opacity-50 hover:cursor-pointer'
         }`}
      >
         <span>See More</span>
         <ArrowDownIcon height='25' width='20' />{' '}
      </button>
   );

   return (
      <section id='Description'>
         {isDescriptionEmpty ? (
            <NoDescription />
         ) : (
            <>
               {!toggleDescription ? (
                  <>
                     <CollapsedDescription
                        description={displayedDescription}
                        descriptionLimit={descriptionLimit}
                        lineClamp={lineClamp}
                        isLink={isLink}
                        className={className}
                     />
                     {SeeMoreElement}
                  </>
               ) : (
                  <ExpandedDescription description={filteredDescription.toString()} />
               )}
            </>
         )}
         <button
            role='button'
            aria-expanded={toggleDescription}
            onClick={() => setToggleDescription(false)}
            className={`${
               !toggleDescription
                  ? 'hidden'
                  : 'flex font-semibold hover:cursor-pointer hover:opacity-50 dark:text-slate-200'
            } py-2`}
         >
            <span>See Less</span> <ArrowUpIcon aria-hidden height='25' width='20' />
         </button>
      </section>
   );
};

const NoDescription = () => (
   <p aria-live='assertive' className='text-lg dark:text-slate-100'>
      No description provided
   </p>
);

const CollapsedDescription = ({
   description,
   descriptionLimit,
   isLink,
   lineClamp,
   className,
}: {
   description: string;
   isLink?: boolean;
   descriptionLimit?: number;
   className?: string;
   lineClamp?: LineClamp;
   // textSize?: TextSize;
}) => (
   <div className={classNames(isLink ? 'mb-0' : 'mb-5', 'relative')}>
      <p
         aria-live='polite'
         aria-label='Collapsed book description'
         className={clsx(`${lineClamp} dark:text-slate-100 `, className)}
      >
         {descriptionLimit ? description.slice(0, descriptionLimit) + '...' : description}
      </p>
      <div
         className={classNames(
            isLink
               ? 'hidden'
               : 'absolute h-14 w-full top-7 bg-gradient-to-b from-slate-100/5 to-[#ffffff] dark:from-slate-800/50 dark:to-slate-800 dark:opacity-90'
         )}
      ></div>
   </div>
);

const ExpandedDescription = ({
   description,
   textSize,
}: {
   description: string;
   textSize?: TextSize;
}) => (
   <p
      aria-live='polite'
      className={classNames(`${textSize}, dark:text-slate-100 leading-relaxed`)}
      aria-label='Expanded book description'
   >
      {description}
   </p>
);

export default BookDescription;
