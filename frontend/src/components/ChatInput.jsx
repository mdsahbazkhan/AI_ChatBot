import { useState, useRef, useEffect } from "react";

export const ChatInput = ({ onSend, onFileUpload, isLoading }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
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

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    e.target.value = "";
  };

  return (
    <div className="shrink-0 px-3 py-3 sm:px-4 sm:py-3 border-t border-gray-700 bg-gray-900/60 backdrop-blur-sm">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-end gap-2">
        <button
          type="button"
          onClick={handleFileSelect}
          disabled={isLoading}
          title="Upload PDF"
          className="p-2.5 sm:p-3 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shrink-0 active:scale-95"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </button>

        <div className="flex-1 relative min-w-0">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Velquix..."
            rows={1}
            disabled={isLoading}
            className="w-full resize-none rounded-xl bg-gray-800 border border-gray-700 px-3 py-2.5 sm:py-3 text-[16px] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 max-h-[160px] overflow-y-auto disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`
            p-2.5 sm:p-3 rounded-xl transition-all duration-200 shrink-0 active:scale-95
            ${message.trim() && !isLoading
              ? "bg-indigo-600 hover:bg-indigo-500 cursor-pointer shadow-lg shadow-indigo-500/20"
              : "bg-gray-800 cursor-not-allowed opacity-50"
            }
          `}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
          </svg>
        </button>
      </form>

      <p className="text-center text-[10px] text-gray-600 mt-2 sm:hidden">
        Shift + Enter for new line
      </p>
    </div>
  );
};
