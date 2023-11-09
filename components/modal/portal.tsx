import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import SideNavigation, { SideNavigationProps } from '../headers/sidebar';

const SideBarPortal = ({ sidebarOpen, setSidebarOpen }: SideNavigationProps) => {
   const [root, setRoot] = useState<HTMLElement | null>(null);
   //    const portalEl = document.getElementById('sidebar-root');

   useEffect(() => {
      setRoot(document.getElementById('sidebar-root'));
   }, []);

   if (!root) return null;

   return ReactDOM.createPortal(
      <SideNavigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
         {/* Modal content */}
      </SideNavigation>,
      root
   );
};

export default SideBarPortal;
