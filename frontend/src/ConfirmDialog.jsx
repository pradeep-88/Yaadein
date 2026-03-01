import React from "react";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--card-bg)] text-[var(--text)] rounded-lg p-6 w-full max-w-sm shadow-lg border border-[var(--card-border)]">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-[var(--muted)] mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-1 rounded border border-[var(--card-border)] hover:bg-[var(--btn-hover)]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 shadow"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
