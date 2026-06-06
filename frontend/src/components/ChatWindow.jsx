import { useEffect, useRef } from "react";

export const ChatWindow = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 bg-gray-950 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-4 sm:mb-6">
            <svg className="w-7 h-7 sm:w-9 sm:h-9 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Hello, I'm <span className="text-indigo-400">Velquix</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-sm">
            Ask me anything, or upload a PDF and I'll answer questions grounded in its content.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Summarize a document", "Answer questions", "Analyze data"].map((hint) => (
              <span key={hint} className="px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-400">
                {hint}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto w-full">
          {messages.map((msg, index) => {
            const isLastStreaming =
              isLoading && index === messages.length - 1 && msg.role === "ai" && msg.content === "";

            if (msg.role === "system") {
              return (
                <div key={msg.id ?? index} className="fade-in mb-4">
                  <div className="flex justify-center">
                    <div className="px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400 text-xs">
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id ?? index} className="fade-in">
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-3 sm:mb-4 lg:mb-5`}>
                  <div className={`flex items-end gap-2 sm:gap-3 w-full sm:w-auto ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

                    {msg.role !== "user" && (
                      <div className="hidden sm:flex w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shrink-0 items-center justify-center shadow-lg self-end mb-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    )}

                    <div className={`
                      px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl
                      max-w-[85vw] sm:max-w-[75vw] lg:max-w-[65ch]
                      ${msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-sm"
                      }
                    `}>
                      {isLastStreaming ? (
                        <div className="flex items-center gap-1.5 py-0.5">
                          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                        </div>
                      ) : (
                        <p className="text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="hidden sm:flex w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gray-700 border border-gray-600 shrink-0 items-center justify-center self-end mb-0.5">
                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
