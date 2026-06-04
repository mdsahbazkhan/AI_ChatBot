export const Header = () => {
  return (
    <header className="flex items-center px-4 py-3 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm lg:pl-6 lg:pr-6">
      <h1 className="text-lg font-semibold text-white">ChatBot AI</h1>
      <div className="flex-1" />
      <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </header>
  );
};