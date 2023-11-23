import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import SideNavigation, { SideNavigationProps } from '../headers/sidebar';

/**
 * The portal is necessary to render using headless UI. It is designed so that the parent root
 * inert' attribute is added automatically. Using portal here fixes which allows users to interact
 * outside of the current container
 */

const SideBarPortal = ({ sidebarOpen, setSidebarOpen }: SideNavigationProps) => {
   const [root, setRoot] = useState<HTMLElement | null>(null);
   //    const portalEl = document.getElementById('sidebar-root');

   useEffect(() => {
      setRoot(document.getElementById('sidebar-root'));
   }, []);

   if (!root) return null;

   return ReactDOM.createPortal(
      <SideNavigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />,
      root
   );
};

export default SideBarPortal;
