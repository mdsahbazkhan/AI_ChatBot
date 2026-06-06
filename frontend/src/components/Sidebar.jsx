export const Sidebar = ({ isOpen, onClose, onNewChat, onSelectChat, sessions }) => {
  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-64 sm:w-72 lg:w-64
          bg-gray-900 border-r border-gray-700
          flex flex-col h-full shrink-0
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="font-semibold text-white text-sm">Velquix</h2>
          </div>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-3 py-3">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 active:scale-95"
          >
            <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium text-white text-sm">New Chat</span>
          </button>
        </div>

        <div className="px-3 pb-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-1 mb-1">Recent Chats</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="space-y-0.5">
            {sessions.length === 0 && (
              <p className="text-xs text-gray-600 text-center py-6">No conversations yet</p>
            )}
            {sessions.map((session) => (
              <button
                key={session.session_id}
                onClick={() => onSelectChat(session.session_id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-left transition-colors group"
              >
                <span className="text-base shrink-0">{session.has_pdf ? "📄" : "💬"}</span>
                <span className="text-sm text-gray-400 truncate flex-1 group-hover:text-gray-200 transition-colors">
                  {session.title}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};
