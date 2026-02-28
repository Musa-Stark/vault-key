import { createContext, useContext, useState, useCallback } from "react";
const ToastContext = createContext({ toasts: [], showToast: () => {} });
export const useToast = () => useContext(ToastContext);
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);
  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`vault-toast flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
              toast.type === "success"
                ? "bg-green-900 text-white"
                : "bg-red-700 text-white"
            }`}
          >
            {toast.type === "success" ? "✓" : "✕"} {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
