import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";

const typeConfig = {
  info: {
    icon: Info,
    iconClass: "text-blue-500",
    titleClass: "text-blue-700",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-green-500",
    titleClass: "text-green-700",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-yellow-500",
    titleClass: "text-yellow-700",
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-500",
    titleClass: "text-red-700",
  },
};

const AlertDialog = ({
  isOpen,
  type = "info",           
  title = "Aviso",
  message,
  showCancel = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="mt-1">
            <Icon className={config.iconClass} size={24} />
          </div>
          <div>
            <h2 className={`text-lg font-semibold mb-1 ${config.titleClass}`}>
              {title}
            </h2>
            <p className="text-gray-600 whitespace-pre-line">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {showCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          )}

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
