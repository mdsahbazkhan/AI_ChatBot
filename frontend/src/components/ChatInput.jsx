import { useState, useRef, useEffect } from "react";

export const ChatInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-3 border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            disabled={isLoading}
            className="w-full resize-none rounded-xl bg-gray-800 border border-gray-700 px-3 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 max-h-[200px] overflow-y-auto"
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`
            p-3 rounded-xl transition-all duration-200 flex-shrink-0
            ${
              message.trim() && !isLoading
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-gray-800 cursor-not-allowed"
            }
          `}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19V5m0 0l-7 7m7-7l7 7"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};