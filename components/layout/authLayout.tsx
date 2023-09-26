const AuthLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <section className='container min-h-max mx-auto p-4 lg:px-12 xl:px-16 md:max-w-xl'>
         {children}
      </section>
   );
};

export default AuthLayout;
