import { createContext, useContext, useState, useCallback } from "react";
import { Check, X } from "lucide-react";
const ToastContext = createContext({ toasts: [], showToast: () => {} });
export const useToast = () => useContext(ToastContext);
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
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
                ? "bg-green-900 text-green-300"
                : "bg-red-800/40 text-red-300"
            }`}
          >
            {toast.type === "success" ? (
              <Check className="text-green-500" />
            ) : (
              <X className="text-red-500" />
            )}{" "}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
