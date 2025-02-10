import axios from "axios";
import React, { useState } from "react";

// interface RawEarthquakeData {
//    Id: string;
//    Time: string;
//    Latitude: string;
//    Longitude: string;
//    Depth: string;
//    Mag: string;
//    Place: string;
//    Status: string;
// }

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
   //userId: string; // Pass userId here from index.tsx
   saveUserPreferences: (startTime: string, endTime: string, minMagnitude: number, maxMagnitude: number, minDepth: number, maxDepth: number) => Promise<void>;
}

const EarthquakeFilter: React.FC<EarthquakeFilterProps> = ({ onEarthquakesUpdate, saveUserPreferences }) => {
   const [startTime, setStartTime] = useState("2020-01-01");
   const [endTime, setEndTime] = useState("2025-01-01");
   const [minMagnitude, setMinMagnitude] = useState(0);
   const [maxMagnitude, setMaxMagnitude] = useState(10);
   const [minDepth, setMinDepth] = useState(-100);
   const [maxDepth, setMaxDepth] = useState(1000);
   const [numEarthquakes, setNumEarthquakes] = useState(0);

   // Function to transform raw data into Earthquake interface
   // const transformData = (data: RawEarthquakeData[]): Earthquake[] => {
   //    return data.map((item) => ({
   //       id: item.Id,
   //       time: item.Time,
   //       place: item.Place,
   //       latitude: parseFloat(item.Latitude),
   //       longitude: parseFloat(item.Longitude),
   //       depth: parseFloat(item.Depth),
   //       mag: parseFloat(item.Mag),
   //       status: item.Status,
   //    }));
   // };

   // Method to query backend API for earthquake data
   const fetchEarthquakeJSON = async () => {
      console.log("Fetching Earthquake JSON from backend");

      try {
         const response = await axios.get("https://earthquake-globe-web-0wajea.fly.dev/api/go/earthquakes", {
         //const response = await axios.get("http://localhost:8080/api/go/earthquakes", {
            params: {
               //userId, // Send userId in the request if needed
               startTime,
               endTime,
               minMagnitude,
               maxMagnitude,
               minDepth,
               maxDepth,
            },
         });

         const rawData = response.data;
         //const earthquakes = transformData(rawData);

         console.log("Earthquake data fetched:", rawData.length);
         console.log(rawData);
         onEarthquakesUpdate(rawData);
         setNumEarthquakes(rawData.length);
      } catch (error) {
         console.error("Error fetching earthquake data:", error);
      }
   };

   return (
      <div className="bg-gray-200 p-4 rounded-lg shadow-md">
         <div className="mb-4">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
               Start Time
            </label>
            <input type="date" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
         </div>

         <div className="mb-4">
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
               End Time
            </label>
            <input type="date" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
         </div>

         <div className="mb-4">
            <label htmlFor="minMagnitude" className="block text-sm font-medium text-gray-700">
               Min Magnitude
            </label>
            <input type="number" id="minMagnitude" value={minMagnitude} onChange={(e) => setMinMagnitude(Number(e.target.value))} min={0} max={10} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
         </div>

         <div className="mb-4">
            <label htmlFor="maxMagnitude" className="block text-sm font-medium text-gray-700">
               Max Magnitude
            </label>
            <input type="number" id="maxMagnitude" value={maxMagnitude} onChange={(e) => setMaxMagnitude(Number(e.target.value))} min={0} max={10} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
         </div>

         <div className="mb-4">
            <label htmlFor="minDepth" className="block text-sm font-medium text-gray-700">
               Min Depth
            </label>
            <input type="number" id="minDepth" value={minDepth} onChange={(e) => setMinDepth(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
         </div>

         <div className="mb-4">
            <label htmlFor="maxDepth" className="block text-sm font-medium text-gray-700">
               Max Depth
            </label>
            <input type="number" id="maxDepth" value={maxDepth} onChange={(e) => setMaxDepth(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
         </div>

         <button onClick={fetchEarthquakeJSON} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Update Earthquakes
         </button>

         <button onClick={() => saveUserPreferences(startTime, endTime, minMagnitude, maxMagnitude, minDepth, maxDepth)} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2">
            Save Preferences
         </button>

         <div className="mt-4">
            <h1 className="text-black">Total Earthquakes: {numEarthquakes}</h1>
         </div>
      </div>
   );
};

export default EarthquakeFilter;
