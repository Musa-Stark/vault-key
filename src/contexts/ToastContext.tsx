import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType>({ toasts: [], showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
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
          <div key={toast.id} className={`vault-toast ${toast.type}`}>
            {toast.type === "success" ? "✓" : "✕"} {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
