export const Header = ({ onOpenSidebar }) => {
  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm shrink-0">
      <button
        className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
        onClick={onOpenSidebar}
        aria-label="Open menu"
      >
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-white leading-none">Velquix</h1>
          <p className="text-[10px] text-indigo-400 leading-none mt-0.5 hidden sm:block">RAG-Powered Intelligent Assistant</p>
        </div>
      </div>
    </header>
  );
};
