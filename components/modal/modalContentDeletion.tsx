import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

export default function DeleteModalContent() {
   return (
      <>
         <div className='flex mb-3 items-center justify-center'>
            <ExclamationTriangleIcon
               className='inline-flex relative top-0 mr-1 '
               height={24}
               width={24}
               fill='orange'
            />
            <p className=''>This action cannot be undone</p>
         </div>
         <p className='text-sm text-gray-500'>
            This will permanently delete your account including all data that are kept in file
         </p>
      </>
   );
}
