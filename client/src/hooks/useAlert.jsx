import React, { useState } from "react";
import AlertDialog from "../components/AlertDialog";

export const useAlert = () => {
  const [options, setOptions] = useState(null);

  const alert = ({ title, message, type = "info" }) =>
    new Promise((resolve) => {
      setOptions({
        isOpen: true,
        type,
        title,
        message,
        showCancel: false,
        onConfirm: () => {
          setOptions(null);
          resolve(true);
        },
      });
    });

  const confirm = ({ title, message, type = "warning" }) =>
    new Promise((resolve) => {
      setOptions({
        isOpen: true,
        type,
        title,
        message,
        showCancel: true,
        onConfirm: () => {
          setOptions(null);
          resolve(true);
        },
        onCancel: () => {
          setOptions(null);
          resolve(false);
        },
      });
    });

  const AlertComponent = options ? (
    <AlertDialog {...options} isOpen={options.isOpen} />
  ) : null;

  return { alert, confirm, AlertComponent };
};
