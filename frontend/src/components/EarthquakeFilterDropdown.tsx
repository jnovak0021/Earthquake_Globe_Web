import { useState } from "react";
import axios from "axios";
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
   userId: string; // Pass userId here from index.tsx
   saveUserPreferences: (startTime: string, endTime: string, minMagnitude: number, maxMagnitude: number, minDepth: number, maxDepth: number) => Promise<void>; // Define the function signature here
}

const EarthquakeFilterDropdown: React.FC<EarthquakeFilterDropdownProps> = ({ onEarthquakesUpdate, userId }) => {
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

   // This function will be passed to EarthquakeFilter to save the user's preferences
   const handleSavePreferences = async (startTime: string, endTime: string, minMagnitude: number, maxMagnitude: number, minDepth: number, maxDepth: number) => {
      if (userId) {
         console.log("Saving preferences for user:", userId); // Log userId here

         try {
            const response = await axios.post("https://earthquake-globe-web-0wajea.fly.dev/api/go/users/preferences", {
               userId,
               startTime,
               endTime,
               minMagnitude,
               maxMagnitude,
               minDepth,
               maxDepth,
            });
            console.log("Preferences saved successfully:", response.data);
         } catch (error) {
            console.error("Error saving preferences:", error);
         }
      } else {
         console.log("No user ID found, unable to save preferences.");
      }
   };

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
               {/* Pass userId here */}
               <EarthquakeFilter onEarthquakesUpdate={onEarthquakesUpdate} userId={userId} saveUserPreferences={handleSavePreferences} />
            </div>
         )}
      </div>
   );
};

export default EarthquakeFilterDropdown;
