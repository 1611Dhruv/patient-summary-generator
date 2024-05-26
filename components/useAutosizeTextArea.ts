import { useEffect } from "react";

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) => {
  useEffect(() => {
    if (textAreaRef) {
      const oldHeight = textAreaRef.style.height;
      textAreaRef.style.height = "0px";
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      const scrollHeight = textAreaRef.scrollHeight;
      if (
        scrollHeight > 150 &&
        scrollHeight > parseInt(oldHeight.substring(0, oldHeight.length - 2))
      ) {
        textAreaRef.style.height = oldHeight;
        return;
      }

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);
};

export default useAutosizeTextArea;
