import { MutableRefObject } from "react";
import { InitialDateRecallerProps } from "../store/atomDates";

export default function accordionCondition<T extends MutableRefObject<any[]>>(
  button: T,
  dateRecaller: InitialDateRecallerProps
) {
  const everyButtons = button.current;
  for (let i = 0; i < everyButtons.length; i++) {
    const buttonIndex = everyButtons[i].getAttribute("data-index-number");
    // if not opened and it is year one
    if (buttonIndex === "1") {
      everyButtons[0].click();
      everyButtons[1].click();
    }
    if (buttonIndex === "2" && buttonIndex !== "3") {
      everyButtons[1].click();
      everyButtons[2].click();
    }
    if (buttonIndex === "2" && buttonIndex === "3" && buttonIndex !== "1") {
      everyButtons[1].close();
    }
    if (buttonIndex === "1" && buttonIndex === "2") {
      everyButtons[0].click();
      everyButtons[1].click();
      everyButtons[2].click();
    }
  }
}
