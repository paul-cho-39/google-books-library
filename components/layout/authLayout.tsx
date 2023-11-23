import NextHead, { MetaTag } from '../headers/header';

interface AuthLayoutProps {
   title: string;
   metaTags: MetaTag[];
   children: React.ReactNode;
}

const AuthLayout = ({ title, metaTags, children }: AuthLayoutProps) => {
   return (
      <section className='min-h-screen mx-auto p-4 lg:px-16 xl:px-20 md:max-w-xl overflow-hidden'>
         {/* <section className='flex flex-col min-h-full'> */}
         <NextHead title={title} metaTags={metaTags} />
         <main className='flex-grow'>{children}</main>
      </section>
   );
};

export default AuthLayout;
