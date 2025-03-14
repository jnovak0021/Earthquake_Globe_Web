import { useState, useEffect } from "react";
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

interface UserPreferences {
   start_time: string;
   end_time: string;
   min_mag: number;
   max_mag: number;
   min_depth: number;
   max_depth: number;
}

interface EarthquakeFilterDropdownProps {
   onEarthquakesUpdate: (earthquakes: Earthquake[]) => void;
   userEmail: string;
   saveUserPreferences: (email: string, startTime: string, endTime: string, minMagnitude: number, maxMagnitude: number, minDepth: number, maxDepth: number) => Promise<void>;
}

const EarthquakeFilterDropdown: React.FC<EarthquakeFilterDropdownProps> = ({ onEarthquakesUpdate, saveUserPreferences, userEmail }) => {
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

   const fetchUserPreferences = async () => {
      if (!userEmail) return;

      const storedPreferences = localStorage.getItem(`preferences_${userEmail}`);
      if (storedPreferences) {
         setUserPreferences(JSON.parse(storedPreferences));
         return;
      }

      try {
         
         //const response = await axios.get(`https://earthquake-globe-web-0wajea.fly.dev/api/go/users/preferences/${userEmail}`);
         //const response = await axios.get(`http://localhost:8080/api/go/users/preferences/${userEmail}`);
         const response = await axios.get(`https://earthquake-globe-web-tqt5rw.fly.dev/api/go/users/preferences/${userEmail}`);

         if (response.data.length > 0) {
            setUserPreferences(response.data[0]);
            localStorage.setItem(`preferences_${userEmail}`, JSON.stringify(response.data[0]));
         }
      } catch (error) {
         console.error("Error fetching user preferences:", error);
      }
   };

   useEffect(() => {
      fetchUserPreferences();
   }, [userEmail]);

   return (
      <div className="relative">
         <button onClick={() => setIsDropdownOpen((prev) => !prev)} className="absolute top-4 right-6 bg-gray-700 hover:bg-gray-600 text-white border-none cursor-pointer text-lg font-semibold flex items-center whitespace-nowrap p-2 rounded-md">
            Apply Earthquake Filter <span className="ml-2">&#9660;</span>
         </button>

         {isDropdownOpen && (
            <div className="absolute top-20 right-12 w-[350px] bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg max-h-[700px] overflow-y-auto">
               <h1 className="text-xl font-bold text-gray-300 mb-4">Earthquake Filter</h1>
               <EarthquakeFilter onEarthquakesUpdate={onEarthquakesUpdate} saveUserPreferences={saveUserPreferences} userEmail={userEmail} savedPreferences={userPreferences} updateUserPreferences={setUserPreferences} />
            </div>
         )}
      </div>
   );
};

export default EarthquakeFilterDropdown;