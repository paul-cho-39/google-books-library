import Image from 'next/image';
import Link from 'next/link';
import ROUTES from '@/utils/routes';

// h-16
const HomeIcon = () => {
   return (
      <>
         {/* dark mdoe */}
         <nav title='Home' className='mr-auto h-16 hidden dark:inline-flex px-10 cursor-pointer'>
            <Link href={ROUTES.HOME} aria-label='Go to homepage'>
               {/* <span className='text-xl font-bold text-slate-800 dark:text-slate-100'>Logo</span> */}
               <Image src={'/logo-dark.png'} alt='Home page logo' width={70} height={64} />
            </Link>
         </nav>
         {/* light mode  */}
         <nav title='Home' className='mr-auto h-16 inline-flex dark:hidden px-10 cursor-pointer'>
            <Link href={ROUTES.HOME} aria-label='Go to homepage'>
               {/* <span className='text-xl font-bold text-slate-800 dark:text-slate-100'>Logo</span> */}
               <Image src={'/logo.png'} alt='Home page logo' width={70} height={64} />
            </Link>
         </nav>
      </>
   );
};

export default HomeIcon;
