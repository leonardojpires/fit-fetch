function SuccessWarning({ message, closeWarning }) {
  return (
    <div className="fixed bottom-3 right-3 z-50 max-w-md animate-slide-in">
      <div className="bg-red-50 border-l-4 border-green-500 rounded-lg shadow-lg !p-4">
        <div className="flex items-start justify-between !mb-2">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-green-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="font-headline font-semibold text-green-800">
              Sucesso!
            </h3>
          </div>
          <button
            onClick={() => {
              closeWarning();
            }}
            className="text-green-400 hover:text-green-600 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="font-body text-sm text-green-600">{ message }</p>
      </div>
    </div>
  );
}

export default SuccessWarning;
