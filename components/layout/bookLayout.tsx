interface LayoutProps {
   children: React.ReactNode;
}

const BookBottomLayout = ({ children }: LayoutProps) => {
   return (
      <div className='w-full lg:px-6 xl:px-12 container max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl'>
         {children}
      </div>
   );
};

const BookTopLayout = ({ children }: LayoutProps) => {
   return (
      <div className='w-full flex flex-col max-w-2xl items-center justify-center p-6 lg:p-10 md:grid md:grid-cols-3 lg:max-w-4xl'>
         {children}
      </div>
   );
};

export { BookBottomLayout, BookTopLayout };
