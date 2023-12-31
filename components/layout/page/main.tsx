import Container from '../container';

const MainLayout = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => {
   const paddingLeft = !isOpen ? 'lg:pl-56' : 'lg:pl-72';
   const paddingRight = !isOpen ? 'lg:pr-12' : 'lg:pr-0';
   return (
      <Container className={`${paddingLeft} ${paddingRight} dark:bg-slate-800`}>
         {children}
      </Container>
   );
};

export default MainLayout;
