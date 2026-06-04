import { useState } from "react";

export const Sidebar = ({ onNewChat, onSelectChat }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dummyChats = [
    { id: 1, title: "How to build a React app?" },
    { id: 2, title: "Explain quantum computing" },
    { id: 3, title: "Write a Python script" },
  ];

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 border border-gray-700 shadow-lg"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-full
        transform transition-transform duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex items-center justify-between p-4">
          <h2 className="font-semibold text-white">Chats</h2>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 pb-2">
          <button
            onClick={() => {
              onNewChat();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium text-white">New Chat</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          <div className="space-y-1">
            {dummyChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  onSelectChat(chat.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-left transition-colors group"
              >
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm text-gray-400 truncate flex-1 group-hover:text-white transition-colors">
                  {chat.title}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};