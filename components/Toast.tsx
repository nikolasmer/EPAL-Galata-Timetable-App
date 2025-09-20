
import React, { useEffect } from 'react';
import { ToastMessage, ToastType } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import CloseIcon from './icons/CloseIcon';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === ToastType.Success;
  const baseClasses = 'flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-lg';
  const themeClasses = {
    [ToastType.Success]: 'text-green-500',
    [ToastType.Error]: 'text-red-500',
  };

  const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

  return (
    <div className={`${baseClasses} dark:text-gray-400 dark:bg-gray-800`} role="alert">
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${themeClasses[toast.type]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="ms-3 text-sm font-normal">{toast.message}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={() => onDismiss(toast.id)}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <CloseIcon className="w-3 h-3" />
      </button>
    </div>
  );
};

export default Toast;
