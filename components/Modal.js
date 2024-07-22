import React from 'react';

const Modal = ({ title, description, confirmText, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h3 className="text-xl mb-4 text-gray-800">{title}</h3>
        <p className="mb-4 text-gray-700">{description}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
