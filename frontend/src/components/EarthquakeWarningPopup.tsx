import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onContinue, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div>{children}</div>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
        <button
          className="mt-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          onClick={onContinue}
        >
          Continue Anyways
        </button>
      </div>
    </div>
  );
};

export default Modal;