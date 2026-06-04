import { useState, useRef } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ChatWindow } from "./components/ChatWindow";
import { ChatInput } from "./components/ChatInput";
import { streamMessage } from "./services/api";

let messageIdCounter = 0;

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const aiMessageIdRef = useRef(null);

  const handleSend = async (content) => {
    const userMessageId = messageIdCounter++;
    const userMessage = { id: userMessageId, role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const aiMessageId = messageIdCounter++;
    aiMessageIdRef.current = aiMessageId;
    setMessages((prev) => [...prev, { id: aiMessageId, role: "ai", content: "" }]);

    try {
      await streamMessage(content, (chunk) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const aiMsgIndex = newMessages.findIndex((m) => m.id === aiMessageIdRef.current);
          
          if (aiMsgIndex !== -1) {
            newMessages[aiMsgIndex] = {
              ...newMessages[aiMsgIndex],
              content: newMessages[aiMsgIndex].content + chunk,
            };
          }
          return newMessages;
        });
      });
    } catch (error) {
      console.error("Error streaming message:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        const aiMsgIndex = newMessages.findIndex((m) => m.id === aiMessageIdRef.current);
        if (aiMsgIndex !== -1) {
          newMessages[aiMsgIndex] = { id: aiMessageIdRef.current, role: "ai", content: "Sorry, there was an error connecting to the server." };
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      aiMessageIdRef.current = null;
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSelectChat = (id) => {
    console.log("Selected chat:", id);
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />

      <main className="flex flex-col flex-1 min-w-0">
        <Header />
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;