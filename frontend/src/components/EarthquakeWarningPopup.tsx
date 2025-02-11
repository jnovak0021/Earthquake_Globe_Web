import React from "react";

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   onContinue: () => void;
   count: number;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onContinue, count }) => {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-70 z-50">
         <div className="fixed inset-0 bg-black opacity-75"></div>
         <div className="bg-black p-6 rounded-lg shadow-lg z-10">
            <h2 className="text-xl font-bold mb-4">Large Number of Earthquakes Queried</h2>
            <div>
               <p>The filters you applied in Earthquake filter are very broad and will generate {count} earthquakes. These large searches are costly for us to handle. Please consider refining your search criteria.</p>
            </div>
            <div className="flex justify-between mt-4">
               <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
                  Close
               </button>
               <button className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600" onClick={onContinue}>
                  Continue Anyways
               </button>
            </div>
         </div>
      </div>
   );
};

export default Modal;
