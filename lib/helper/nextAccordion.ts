import { MutableRefObject } from 'react';

export default function nextAccordion<T extends MutableRefObject<any[]>>(button: T) {
   const buttons = button.current;
   for (let i = 0; i < buttons.length; i++) {
      const buttonIndex = buttons[i].getAttribute('data-index-number');
      // if not opened and it is year one
      if (buttonIndex === '1') {
         buttons[0].click();
         buttons[1].click();
      }
      if (buttonIndex === '2' && buttonIndex !== '3') {
         buttons[1].click();
         buttons[2].click();
      }
      if (buttonIndex === '2' && buttonIndex === '3' && buttonIndex !== '1') {
         buttons[1].close();
      }
      if (buttonIndex === '1' && buttonIndex === '2') {
         buttons[0].click();
         buttons[1].click();
         buttons[2].click();
      }
   }
}
