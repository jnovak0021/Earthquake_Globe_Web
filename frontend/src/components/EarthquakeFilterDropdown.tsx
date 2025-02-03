import { useState } from "react";
import EarthQuakeFilter from "./EarthqaukeFilter";

const EarthquakeFilterDropdown: React.FC = () => {
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

   return (
      <div className="relative">
         {/* Dropdown Trigger */}
         <button onClick={() => setIsDropdownOpen((prev) => !prev)} className="absolute top-4 right-4 bg-transparent text-white border-none cursor-pointer text-lg font-semibold flex items-center whitespace-nowrap">
            Apply Earthquake Filter <span className="ml-2">&#9660;</span>
         </button>

         {/* Dropdown Menu */}
         {isDropdownOpen && (
            <div className="absolute top-20 right-12 w-80 bg-gray-800 bg-opacity-80 p-2 rounded-lg shadow-lg max-h-[700px] overflow-y-auto">
               <h1 className="text-xl font-bold text-white mb-4">Earthquake Filter</h1>
               <EarthQuakeFilter />
            </div>
         )}
      </div>
   );
};

export default EarthquakeFilterDropdown;
