import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ children, isOpen = true, onClose, title, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-6 ${maxWidth} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
        {title && (
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">{title}</h3>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
