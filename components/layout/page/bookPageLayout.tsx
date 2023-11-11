const PageLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className='mx-auto w-full min-h-screen overflow-y-auto dark:bg-slate-800'>
         {children}
      </div>
   );
};

export default PageLayout;
