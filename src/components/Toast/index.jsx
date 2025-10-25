import { useEffect } from "react";

function Toast({ message, onClose, duration = 3000, isError = false }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`${
        isError ? "bg-red-500" : "bg-green-500"
      } fixed bottom-5 right-5 z-50  text-white !px-5 !py-3 rounded-xl shadow-lg flex items-center gap-4 animate-slide-in`}
    >
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className={`${
          isError
            ? "bg-red-700 hover:bg-red-800"
            : "bg-green-700 hover:bg-green-800"
        } text-white  rounded-full w-6 h-6 flex justify-center items-center font-bold cursor-pointer`}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
