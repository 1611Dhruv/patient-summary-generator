"use client";
import { useState, useRef, useEffect } from "react";
import MarkdownPreview from "./MarkdownPreview";
import BouncingDotsLoader from "./BouncingDotsLoader";
import useAutosizeTextArea from "./useAutosizeTextArea";
import "regenerator-runtime/runtime";

export default function ChatMessage({
  message,
  className,
  id,
  in_response,
  deleteMessage,
  saveResponse,
  savePromptUpdate,
}: {
  message: string;
  className: string;
  in_response: string | undefined;
  id: string;
  deleteMessage: (id: string) => void;
  saveResponse: (id: string, response: string) => void;
  savePromptUpdate: (id: string, response: string) => void;
}) {
  const [visibleMessage, setVisibleMessage] = useState<string>(message);
  const [loading, setLoading] = useState<Boolean>(false);
  const [response, setResponse] = useState<string>(
    in_response ? in_response : ""
  );
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const respRef = useRef(null);
  const buttonRef = useRef(null);

  useAutosizeTextArea(inputRef.current, visibleMessage);

  useEffect(() => {
    if (inputRef.current) {
      const oldHeight = inputRef.current.style.height;
      inputRef.current.style.height = "0px";
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      const scrollHeight = inputRef.current.scrollHeight;
      if (
        scrollHeight > 150 &&
        scrollHeight > parseInt(oldHeight.substring(0, oldHeight.length - 2))
      ) {
        inputRef.current.style.height = oldHeight;
        return;
      }

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      inputRef.current.style.height = scrollHeight + "px";
    }
  }, []);

  const fetchResponse = async () => {
    setLoading(true);
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: visibleMessage, //Or your prefercyan prompt
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    const generatedData = await JSON.parse(data.response);
    const resp = generatedData.candidates[0].content.parts[0].text;
    console.log(resp);
    setResponse(resp);
    saveResponse(id, resp);
    setLoading(false);
  };

  useEffect(() => {
    // @ts-ignore
    buttonRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [loading]);
  const copyFormatted = (html: string) => {
    // Create an iframe (isolated container) for the HTML
    var container = document.createElement("span");
    // Hide element
    container.style.position = "fixed";
    container.style.pointerEvents = "none";
    container.style.opacity = "0";
    container.innerHTML = html;

    document.body.appendChild(container);

    window.getSelection()!.removeAllRanges();

    var range = document.createRange();
    range.selectNode(container);
    window.getSelection()!.addRange(range);

    document.execCommand("copy");

    document.body.removeChild(container);
  };

  const copyToClip = () => {
    try {
      // @ts-ignore
      const content = respRef.current.innerHTML;
      copyFormatted(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      // Handle error with user feedback - "Copy failed!" kind of thing
      console.log(e);
    }
  };
  return (
    <div
      className={
        className +
        " w-[40rem] px-10 py-8 mx-auto bg-white rounded-lg shadow-xl"
      }
    >
      <div className="mx-auto space-y-6">
        <textarea
          ref={inputRef}
          value={visibleMessage}
          onChange={(e) => {
            setVisibleMessage(e.target.value);
            savePromptUpdate(id, e.target.value);
          }}
          className="font-normal text-gray-700 w-full focus-visible:outline-none 
          resize-none pb-0 leading-[1.5] space-y-0 max-h-[150px]"
        />
        <div style={{ borderTop: "1px solid #ccc", margin: "8px 0px" }}></div>
        {/* <p className="font-normal text-gray-700">{message}</p> */}
        {loading ? (
          <BouncingDotsLoader />
        ) : (
          <div ref={respRef} className="text-base leading-3">
            {response == "" ? (
              <p className=" text-base text-center py-2">
                Generate response now, or change your prompt!
              </p>
            ) : (
              <MarkdownPreview markdown={response} />
            )}
          </div>
        )}
        <div className=" flex  justify-between w-full">
          <button
            onClick={fetchResponse}
            ref={buttonRef}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-cyan-800 text-white shadow hover:bg-primary/90 h-9 px-4 py-2 hover:bg-cyan-700"
          >
            Generate Response
          </button>
          <div>
            {/* Copy Button */}
            <button
              onClick={copyToClip}
              className=" text-white bg-cyan-800 hover:bg-emerald-400 rounded-lg p-2 inline-flex items-center justify-center h-[40px] w-[40px]"
            >
              {!copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6  text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                  />
                </svg>
              ) : (
                <svg
                  className="size-6  text-white w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 12"
                >
                  <path
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5.917 5.724 10.5 15 1.5"
                  />
                </svg>
              )}
            </button>
            {/* Delete Button */}
            <button
              onClick={() => deleteMessage(id)}
              className=" text-white bg-cyan-800 hover:bg-red-500 rounded-lg p-2 inline-flex items-center justify-center h-[40px] w-[40px] ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
