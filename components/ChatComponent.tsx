"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import InputComponent from "./InputComponent";
import { v4 as uuidv4 } from "uuid";

type ChatType = {
  message: string;
  response?: string;
  uuid: string;
};

const ChatComponent = () => {
  // State to store chat messages
  const [messages, setMessages] = useState<ChatType[]>([]);
  const [userInput, setUserInput] = useState<string>();

  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  // Function to add a new message to the chat
  const addMessage = (newMessage: string) => {
    setMessages((prevMessages) => {
      let newChat: ChatType | undefined = undefined;
      const oldMessagesUid = prevMessages.map((e) => e.uuid);
      while (!newChat || oldMessagesUid.includes(newChat.uuid)) {
        newChat = {
          message: newMessage,
          uuid: uuidv4(),
        };
      }
      const updatedMessages = [...prevMessages, newChat];
      if (typeof window !== "undefined")
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });
    if (listRef.current) {
      // console.log("scrolling");
      // @ts-ignore
      listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const saveResponse = (id: string, response: string) => {
    setMessages((old) => {
      let i = 0;
      for (let m of old) {
        if (m.uuid === id) {
          break;
        }
        i++;
      }
      console.log(i);
      const la = old;
      la[i].response = response;
      return la;
    });

    if (typeof window !== "undefined")
      localStorage.setItem("chatMessages", JSON.stringify(messages));
  };

  const savePromptUpdate = (id: string, prompt: string) => {
    setMessages((old) => {
      let i = 0;
      for (let m of old) {
        if (m.uuid === id) {
          break;
        }
        i++;
      }
      console.log(i);
      const la = old;
      la[i].message = prompt;
      return la;
    });
    if (typeof window !== "undefined")
      localStorage.setItem("chatMessages", JSON.stringify(messages));
  };

  const deleteMessage = (id: string) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.filter((e) => e.uuid !== id);
      if (typeof window !== "undefined")
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  useEffect(() => {
    const data = localStorage.getItem("chatMessages");
    if (data) {
      setMessages(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  return loading ? (
    <div className="justify-center min-h-screen from-cyan-500 via-cyan-800 to-cyan-950 bg-gradient-to-br flex items-center align-middle">
      <div className="spinner"></div>
    </div>
  ) : (
    <div className="justify-center min-h-screen from-cyan-500 via-cyan-800 to-cyan-950 bg-gradient-to-br">
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
              in_response={chat.response}
              deleteMessage={deleteMessage}
              saveResponse={saveResponse}
              savePromptUpdate={savePromptUpdate}
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
