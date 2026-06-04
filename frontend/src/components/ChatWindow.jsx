import { useEffect, useRef } from "react";

export const ChatWindow = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 bg-gray-950 lg:px-4 lg:py-6">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center mb-4 lg:mb-6">
            <svg className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-xl lg:text-2xl font-semibold text-white mb-2 lg:mb-3">How can I help you today?</h2>
          <p className="text-sm lg:text-base text-gray-400 max-w-md px-2 lg:px-0">Start a conversation by typing a message below. I can help with questions, creative tasks, coding, and more.</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {messages.map((msg, index) => {
            const isLastStreaming = isLoading && index === messages.length - 1 && msg.role === "ai" && msg.content === "";
            return (
              <div key={msg.id || index} className="fade-in">
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-4 lg:mb-6`}>
                  <div className={`flex items-start gap-3 lg:gap-4 max-w-[90%] lg:max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {msg.role !== "user" && (
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-8-4z" />
                        </svg>
                      </div>
                    )}

                    <div className={`
                      px-4 py-3 lg:px-5 lg:py-4 rounded-2xl transition-all duration-200
                      ${msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-md"
                      }
                    `}>
                      {isLastStreaming ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                        </div>
                      ) : (
                        <p className="text-[14px] lg:text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-800 border border-gray-700 flex-shrink-0 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 11 8 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};