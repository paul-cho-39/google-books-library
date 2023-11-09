import Document, { Html, Head, Main, NextScript } from 'next/document';

// creating a portal to place SideBar component @headless/ui force insert 'inert' at the parent
class MyDocument extends Document {
   render() {
      return (
         <Html>
            <Head />
            <body>
               <Main />
               <NextScript />
               <div id='sidebar-root'></div>
            </body>
         </Html>
      );
   }
}

export default MyDocument;
