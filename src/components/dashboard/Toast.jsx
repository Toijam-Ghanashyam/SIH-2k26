import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

/**
 * Toast — Lightweight self-built toast notification.
 * No external library needed.
 *
 * Props:
 *  - message: string to display
 *  - type: 'success' | 'error'
 *  - onClose: callback to dismiss
 *  - duration: auto-dismiss in ms (default 4000)
 */
const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[9999] animate-toast-in">
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-xl border max-w-full sm:max-w-sm mx-auto ${
          isSuccess
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}
      >
        {isSuccess ? (
          <CheckCircle size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
        )}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-0.5 rounded hover:bg-black/5 transition-colors flex-shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
