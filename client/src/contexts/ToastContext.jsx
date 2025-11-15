import React, { createContext, useContext, useState, useCallback } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";

const ToastContext = createContext(null);

const typeConfig = {
  info: {
    icon: Info,
    baseClass: "border-blue-200 bg-blue-50 text-blue-800",
  },
  success: {
    icon: CheckCircle2,
    baseClass: "border-green-200 bg-green-50 text-green-800",
  },
  warning: {
    icon: AlertTriangle,
    baseClass: "border-yellow-200 bg-yellow-50 text-yellow-800",
  },
  error: {
    icon: XCircle,
    baseClass: "border-red-200 bg-red-50 text-red-800",
  },
};

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ title, message, type = "info", duration = 4000 }) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* container de toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map((toast) => {
          const config = typeConfig[toast.type] || typeConfig.info;
          const Icon = config.icon;
          return (
            <div
              key={toast.id}
              className={`w-80 border rounded-lg shadow-sm px-4 py-3 flex items-start gap-2 ${config.baseClass}`}
            >
              <Icon size={20} className="mt-0.5" />
              <div className="flex-1">
                {toast.title && (
                  <p className="font-semibold text-sm">{toast.title}</p>
                )}
                {toast.message && (
                  <p className="text-xs mt-0.5 whitespace-pre-line">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                className="text-xs opacity-70 hover:opacity-100"
                onClick={() => removeToast(toast.id)}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }
  return ctx;
};
