
import React from 'react';

interface ErrorModalProps {
  message: string | null;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center p-4 z-[100] transition-opacity duration-150 ease-in-out"
      aria-labelledby="error-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-700 p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-150 ease-in-out scale-100 border border-slate-600">
        <h4 id="error-modal-title" className="text-xl font-semibold text-red-400 mb-4 text-center">Login Error</h4>
        <p className="text-sm text-slate-200 mb-6 text-center">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-700 transition-colors font-medium"
          aria-label="Close error message"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
