import { Disclosure } from '@headlessui/react';
import { CalendarIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

interface DisclosureProps<T extends string | number = string> {
   disclosureName: T;
   children: React.ReactNode;
}

// // set max-h-3??
// // changed name to Accordian change in every other places
const Accordian = ({ disclosureName, children }: DisclosureProps) => {
   // open with additional parameters with atoms?
   // const { disclosureName, isOpen, children } = props;
   return (
      <Disclosure>
         {({ open }) => (
            <>
               <Disclosure.Button className='flex w-full justify-between rounded-lg bg-gray-100 px-4 py-3 text-left text-sm font-medium text-black hover:bg-gray-400/20 dark:hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                  <span>{disclosureName}</span>
                  <ChevronUpIcon
                     className={`${open ? 'rotate-180 transform duration-200' : 'duration-200'}
              h-5 w-5 text-black`}
                  />
                  {/* delete if it doesnt work?  */}
               </Disclosure.Button>
               <Disclosure.Panel className='px-1 pt-1 pb-5 text-sm text-gray-500 last-of-type:mb-8'>
                  {children}
               </Disclosure.Panel>
            </>
         )}
      </Disclosure>
   );
};

// // forward refs here?
export default Accordian;
