"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import InputComponent from "./InputComponent";
import { v4 as uuidv4 } from "uuid";
type ChatType = {
  message: string;
  uuid: string;
};

const ChatComponent = () => {
  // State to store chat messages
  const [messages, setMessages] = useState<ChatType[]>([]);
  const [userInput, setUserInput] = useState<string>();
  const listRef = useRef(null);

  // Function to add a new message to the chat
  const addMessage = (newMessage: string) => {
    const newChat: ChatType = {
      message: newMessage,
      uuid: uuidv4(),
    };
    setMessages((prevMessages) => [...prevMessages, newChat]);
  };

  const deleteMessage = (id: string) => {
    setMessages((prevMessages) => {
      const newMsg = prevMessages.filter((e) => e.uuid != id);
      return newMsg;
    });
  };

  useEffect(() => {
    if (listRef.current) {
      // console.log("scrolling");
      // @ts-ignore
      listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="justify-center min-h-screen from-stone-400 via-stone-700 to-stone-900 bg-gradient-to-br">
      {/* Chat bubbles */}
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[47rem] w-[50rem] m-auto">
          <h1 className="text-5xl font-bold text-white mb-4">
            Patient Summary Generator
          </h1>
          <p className="text-xl text-white mb-6">
            Enter a prompt to generate patient summaries.
          </p>
          <p className="text-white text-lg text-center">
            You can edit the prompt by double-clicking on the prompt itself.
            After you enter the prompt, you need to click on generate text to
            actually generate the summary. You can click on the trash icon to
            get rid of a specific prompt.
          </p>
        </div>
      ) : (
        <div
          ref={listRef}
          className="flex-col items-center overflow-scroll h-[47rem] pt-5"
        >
          {messages.map((chat, index) => (
            <ChatMessage
              key={chat.uuid}
              className=" mb-2"
              message={chat.message}
              id={chat.uuid}
              deleteMessage={deleteMessage}
            />
          ))}
          <div className=" h-6" />
        </div>
      )}

      {/* Input area */}
      <InputComponent
        userInput={userInput}
        setUserInput={setUserInput}
        addMessage={addMessage}
      />
    </div>
  );
};

export default ChatComponent;
