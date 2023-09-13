import Container from '../container';

const HomeLayout = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => {
   const paddingLeft = !isOpen ? 'lg:pl-56' : 'lg:pl-72';
   const paddingRight = !isOpen ? 'lg:pr-12' : 'lg:pr-0';
   return <Container className={`${paddingLeft} ${paddingRight}`}>{children}</Container>;
};

export default HomeLayout;
