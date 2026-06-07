import { useState, useRef, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ChatWindow } from "./components/ChatWindow";
import { ChatInput } from "./components/ChatInput";
import { getSessions, streamMessage, getChatHistory } from "./services/api";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

let messageIdCounter = 0;

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const aiMessageIdRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const createSession = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/session`, {
        method: "POST",
      });

      const data = await response.json();

      setSessionId(data.session_id);

      return data.session_id;
    } catch (error) {
      console.error("Session creation failed", error);
    }
  };
  const loadSessions = async () => {
    try {
      const data = await getSessions();

      setSessions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = async (content) => {
    if (!sessionId) {
      return;
    }

    const userMessageId = messageIdCounter++;
    const userMessage = { id: userMessageId, role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const aiMessageId = messageIdCounter++;
    aiMessageIdRef.current = aiMessageId;
    setMessages((prev) => [
      ...prev,
      { id: aiMessageId, role: "ai", content: "" },
    ]);

    try {
      await streamMessage(sessionId, content, (chunk) => {
        if (!chunk) return;
        const currentAiId = aiMessageIdRef.current;
        setMessages((prev) => {
          const newMessages = [...prev];
          const aiMsgIndex = newMessages.findIndex(
            (m) => m.id === currentAiId,
          );

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
        const aiMsgIndex = newMessages.findIndex(
          (m) => m.id === aiMessageIdRef.current,
        );
        if (aiMsgIndex !== -1) {
          newMessages[aiMsgIndex] = {
            id: aiMessageIdRef.current,
            role: "ai",
            content: "Sorry, there was an error connecting to the server.",
          };
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      aiMessageIdRef.current = null;
    }
  };

  const handleFileUpload = async (file) => {
    if (file === null) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/upload-pdf`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      const sysMessageId = messageIdCounter++;
      setMessages((prev) => [
        ...prev,
        {
          id: sysMessageId,
          role: "system",
          content: `📄 ${result.filename} uploaded successfully`,
        },
      ]);

      toast.success(
        `PDF uploaded successfully! ${result.chunks} chunks processed.`,
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    setMessages([]);
    setSidebarOpen(false);
    await createSession();
    await loadSessions();
  };

  const handleSelectChat = async (id) => {
    try {
      const history = await getChatHistory(id);

      setSessionId(id);
      setSidebarOpen(false);

      let idCounter = 0;

      const formatted = history.map((msg) => ({
        id: idCounter++,

        role: msg.role === "assistant" ? "ai" : "user",

        content: msg.content,
      }));

      setMessages(formatted);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      await loadSessions();
      if (sessions.length > 0) {
        handleSelectChat(sessions[0].id);
      }
    })();
  }, []);

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        sessions={sessions}
      />

      <main className="flex flex-col flex-1 min-w-0">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput
          onSend={handleSend}
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;
