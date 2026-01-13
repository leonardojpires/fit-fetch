function ErrorWarning({ validationErrors, clearErrors }) {
  return (
    <div 
      className="fixed bottom-3 right-3 z-50 max-w-md animate-slide-in"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg !p-4">
        <div className="flex items-start justify-between !mb-2">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-red-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="font-headline font-semibold text-red-800">
              Erros de validação
            </h3>
          </div>
          <button
            onClick={() => {
              clearErrors();
            }}
            className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
            aria-label="Fechar notificação de erro"
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
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
        <ul className="space-y-2">
          {validationErrors.map((err, index) => (
            <li
              key={index}
              className="font-body text-red-700 text-sm flex items-start gap-2"
            >
              <span className="text-red-500 mt-0.5">•</span>
              <span>
                <span className="font-semibold capitalize">{err.field}:</span>{" "}
                {err.message}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ErrorWarning;
