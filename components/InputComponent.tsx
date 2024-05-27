import { useRef } from "react";
import useAutosizeTextArea from "./useAutosizeTextArea";

export default function InputComponent({
  userInput,
  setUserInput,
  addMessage,
}: {
  userInput: string | undefined;
  setUserInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  addMessage: (newMessage: string) => void;
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(inputRef.current, userInput!);
  return (
    <div className=" w-[50rem] absolute left-1/2 -translate-x-1/2 bottom-6">
      <label className="sr-only">Your message</label>
      <div className="flex items-center py-2 px-3 bg-cyan-600 rounded-lg">
        <div
          style={{
            verticalAlign: "bottom",
            display: "tableCell",
            width: "100%",
          }}
        >
          <textarea
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.keyCode === 13 && !e.shiftKey) {
                e.preventDefault();

                if (userInput == undefined || userInput.trim() === "") {
                  return;
                }
                addMessage(userInput!);
                setUserInput("");
              }
            }}
            id="chat"
            className="block mx-4 p-2.5 w-full bg-cyan-600  rounded-lg 
        placeholder:text-gray-300 text-white text-base
        focus-visible:outline-none caret-white h-[44px] max-h-[150px]"
            style={{ resize: "none" }}
            value={userInput}
            placeholder="Your message..."
            onChange={(e) => {
              setUserInput(e.target.value);
              // console.log(userInput);
            }}
          ></textarea>
        </div>

        <button
          onClick={() => {
            if (userInput == undefined || userInput.trim() === "") {
              return;
            }
            addMessage(userInput!);
            setUserInput("");
          }}
          className={`inline-flex justify-center p-2 ${
            userInput == undefined || userInput === ""
              ? "text-gray-400 cursor-not-allowed"
              : "text-white hover:bg-cyan-800"
          } rounded-full cursor-pointer 
           transition-colors`}
        >
          <svg
            className={`w-6 h-6 rotate-90 ${
              userInput == undefined || userInput.trim() === ""
                ? "fill-gray-300 cursor-not-allowed"
                : " fill-white"
            }`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
