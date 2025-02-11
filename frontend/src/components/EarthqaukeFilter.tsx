import axios from "axios";
import React, { useState, useEffect } from "react";

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

interface EarthquakeFilterProps {
   onEarthquakesUpdate: (earthquakes: Earthquake[]) => void;
   saveUserPreferences: (email: string, startTime: string, endTime: string, minMagnitude: number, maxMagnitude: number, minDepth: number, maxDepth: number) => Promise<void>;
   userEmail: string;
   savedPreferences: { start_time: string; end_time: string; min_mag: number; max_mag: number; min_depth: number; max_depth: number } | null;
   updateUserPreferences: React.Dispatch<React.SetStateAction<{ start_time: string; end_time: string; min_mag: number; max_mag: number; min_depth: number; max_depth: number } | null>>;
}

// Function to format date correctly
const formatDate = (dateString: string | null) => {
   if (!dateString) return "";
   return dateString.split(" ")[0]; // Converts "yyyy-MM-dd HH:mm:ss" → "yyyy-MM-dd"
};

const EarthquakeFilter: React.FC<EarthquakeFilterProps> = ({ onEarthquakesUpdate, saveUserPreferences, userEmail, savedPreferences, updateUserPreferences }) => {
   const [startTime, setStartTime] = useState("2020-01-01");
   const [endTime, setEndTime] = useState("2025-01-01");
   const [minMagnitude, setMinMagnitude] = useState(0);
   const [maxMagnitude, setMaxMagnitude] = useState(10);
   const [minDepth, setMinDepth] = useState(-100);
   const [maxDepth, setMaxDepth] = useState(1000);
   const [numEarthquakes, setNumEarthquakes] = useState(0);

   useEffect(() => {
      if (savedPreferences) {
         setStartTime(formatDate(savedPreferences.start_time));
         setEndTime(formatDate(savedPreferences.end_time));
         setMinMagnitude(savedPreferences.min_mag);
         setMaxMagnitude(savedPreferences.max_mag);
         setMinDepth(savedPreferences.min_depth);
         setMaxDepth(savedPreferences.max_depth);
      }
   }, [savedPreferences]);

   const fetchEarthquakeJSON = async () => {
      try {
         const response = await axios.get("http://localhost:8080/api/go/earthquakes", {
            params: {
               startTime,
               endTime,
               minMagnitude,
               maxMagnitude,
               minDepth,
               maxDepth,
            },
         });

         onEarthquakesUpdate(response.data);
         setNumEarthquakes(response.data.length);
      } catch (error) {
         console.error("Error fetching earthquake data:", error);
      }
   };

   const handleSavePreferences = async () => {
      await saveUserPreferences(userEmail, startTime, endTime, minMagnitude, maxMagnitude, minDepth, maxDepth);

      const updatedPreferences = {
         start_time: startTime,
         end_time: endTime,
         min_mag: minMagnitude,
         max_mag: maxMagnitude,
         min_depth: minDepth,
         max_depth: maxDepth,
      };

      // Save to `localStorage`
      localStorage.setItem(`preferences_${userEmail}`, JSON.stringify(updatedPreferences));

      // Update UI instantly
      updateUserPreferences(updatedPreferences);
      console.log("Preferences saved and updated in UI:", updatedPreferences);
   };

   return (
      <div className="bg-gray-200 p-4 rounded-lg shadow-md">
         {/* Start Time */}
         <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input type="date" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
         </div>

         {/* End Time */}
         <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input type="date" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
         </div>

         {/* Min Magnitude */}
         <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Min Magnitude</label>
            <input type="number" value={minMagnitude} onChange={(e) => setMinMagnitude(Number(e.target.value))} className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
         </div>

         {/* Max Magnitude */}
         <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Max Magnitude</label>
            <input type="number" value={maxMagnitude} onChange={(e) => setMaxMagnitude(Number(e.target.value))} className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
         </div>

         {/* Min Depth */}
         <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Min Depth</label>
            <input type="number" value={minDepth} onChange={(e) => setMinDepth(Number(e.target.value))} className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
         </div>

         {/* Max Depth */}
         <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Max Depth</label>
            <input type="number" value={maxDepth} onChange={(e) => setMaxDepth(Number(e.target.value))} className="block w-full px-3 py-2 border border-gray-300 rounded-md" />
         </div>

         {/* Update Earthquakes Button */}
         <button onClick={fetchEarthquakeJSON} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Update Earthquakes
         </button>

         {/* Save Preferences Button */}
         <button onClick={handleSavePreferences} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2">
            Save Preferences
         </button>

         {/* Display Total Earthquakes */}
         <div className="mt-4">
            <h1 className="text-black">Total Earthquakes: {numEarthquakes}</h1>
         </div>
      </div>
   );
};

export default EarthquakeFilter;
