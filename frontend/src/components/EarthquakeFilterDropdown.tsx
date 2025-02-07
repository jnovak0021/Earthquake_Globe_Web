import { useState } from "react";
import EarthquakeFilter from "./EarthqaukeFilter";

interface Earthquake {
   id: string;
   time: string;
   place: string;
   latitude: number;
   longitude: number;
   depth: number;
   mag: number;
   status: string;
}
interface EarthquakeFilterDropdownProps {
   onEarthquakesUpdate: (earthquakes: Earthquake[]) => void;
}

const EarthquakeFilterDropdown: React.FC<EarthquakeFilterDropdownProps> = ({ onEarthquakesUpdate }) => {
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
               <EarthquakeFilter onEarthquakesUpdate={onEarthquakesUpdate} />
            </div>
         )}
      </div>
   );
};

export default EarthquakeFilterDropdown;
