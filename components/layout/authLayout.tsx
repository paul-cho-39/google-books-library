const AuthLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <section className='container min-h-max mx-auto p-4 lg:px-16 xl:px-20 md:max-w-xl overflow-hidden'>
         {children}
      </section>
   );
};

export default AuthLayout;
