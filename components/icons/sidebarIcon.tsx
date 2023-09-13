import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';

const SidebarIcon = ({
   isSidebarOpen,
   className,
}: {
   isSidebarOpen: boolean;
   className?: string;
}) => {
   return (
      <div className={className}>
         {isSidebarOpen ? (
            <ArrowLeftOnRectangleIcon className='h-10 w-10 dark:stroke-slate-100' />
         ) : (
            <ArrowRightOnRectangleIcon className='h-10 w-10 dark:stroke-slate-100' />
         )}
      </div>
   );
};

export default SidebarIcon;
