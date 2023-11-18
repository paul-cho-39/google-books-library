import NextHead, { MetaTag } from '../headers/header';

interface AuthLayoutProps {
   title: string;
   metaTags: MetaTag[];
   children: React.ReactNode
}

const AuthLayout = ({ title, metaTags, children }: AuthLayoutProps) => {
   return (
      <section className='container min-h-max mx-auto p-4 lg:px-16 xl:px-20 md:max-w-xl overflow-hidden'>
         <NextHead title={title} metaTags={metaTags} />
         {children}
      </section>
   );
};

export default AuthLayout;
