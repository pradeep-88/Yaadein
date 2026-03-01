import React, { createContext, useContext, useState, useCallback } from "react";
import ConfirmDialog from "./ConfirmDialog";

const ConfirmDialogContext = createContext();

export const useConfirmDialog = () => useContext(ConfirmDialogContext);

export const ConfirmDialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const openConfirm = useCallback((title, message, onConfirm) => {
    setDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  }, []);

  const closeConfirm = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmDialogContext.Provider value={{ openConfirm }}>
      {children}
      <ConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        onConfirm={() => {
          dialog.onConfirm();
          closeConfirm();
        }}
        onCancel={closeConfirm}
      />
    </ConfirmDialogContext.Provider>
  );
};
