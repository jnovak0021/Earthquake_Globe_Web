import React, { useState } from "react";

interface Earthquake {
   properties: {
      place: string;
      mag: number;
      depth?: number;
   };
   geometry?: {
      coordinates: number[];
   };
}

interface EarthquakeFilterProps {
   onEarthquakesUpdate: (earthquakes: Earthquake[]) => void;
}

const EarthquakeFilter: React.FC<EarthquakeFilterProps> = ({ onEarthquakesUpdate }) => {
   const [startTime, setStartTime] = useState("2020-01-01");
   const [endTime, setEndTime] = useState("2025-01-01");
   const [minMagnitude, setMinMagnitude] = useState("0");
   const [maxMagnitude, setMaxMagnitude] = useState("10");
   const [minDepth, setMinDepth] = useState("-100");
   const [maxDepth, setMaxDepth] = useState("1000");
   const [kmlColorBy, setKmlColorBy] = useState("depth");
   const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
   const [loading, setLoading] = useState(false);

   const fetchPageData = async (offset: number, limit: number): Promise<Earthquake[]> => {
      const response = await fetch(
         `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=${minMagnitude}&maxmagnitude=${maxMagnitude}&mindepth=${minDepth}&maxdepth=${maxDepth}&offset=${offset}&limit=${limit}`
      );
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const data = await response.json();
      return data.features || [];
   };

   const fetchAllData = async (): Promise<Earthquake[]> => {
      const limit = 50;
      let offset = 1;
      let allData: Earthquake[] = [];
      let hasMoreData = true;

      while (hasMoreData) {
         const promises = [];
         for (let i = 0; i < 10; i++) {
            promises.push(fetchPageData(offset + i * limit, limit));
         }

         const results = await Promise.all(promises);
         const newData = results.flat();
         allData = allData.concat(newData);

         if (newData.length < limit * 10) {
            hasMoreData = false;
         } else {
            offset += limit * 10;
         }
      }

      return allData;
   };

   const handleApiCall = async () => {
      setLoading(true);
      try {
         const allData = await fetchAllData();
         setEarthquakes(allData);
         onEarthquakesUpdate(allData);
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="bg-gray-200 p-4 rounded-lg shadow-md">
         <div className="mb-2">
            <h2 className="text-lg font-semibold text-black mb-2">Time Range</h2>
            <input type="text" placeholder="Start Time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full p-2 mb-2 border border-gray-300 rounded text-black" />
            <input type="text" placeholder="End Time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full p-2 mb-2 border border-gray-300 rounded text-black" />
         </div>

         <div className="mb-2">
            <h2 className="text-lg font-semibold text-black mb-2">Magnitude Range</h2>
            <input type="text" placeholder="Min Magnitude" value={minMagnitude} onChange={(e) => setMinMagnitude(e.target.value)} className="w-full p-2 mb-2 border border-gray-300 rounded text-black" />
            <input type="text" placeholder="Max Magnitude" value={maxMagnitude} onChange={(e) => setMaxMagnitude(e.target.value)} className="w-full p-2 mb-2 border border-gray-300 rounded text-black" />
         </div>

         <div className="mb-2">
            <h2 className="text-lg font-semibold text-black mb-2">Depth Range</h2>
            <input type="text" placeholder="Min Depth" value={minDepth} onChange={(e) => setMinDepth(e.target.value)} className="w-full p-2 mb-2 border border-gray-300 rounded text-black" />
            <input type="text" placeholder="Max Depth" value={maxDepth} onChange={(e) => setMaxDepth(e.target.value)} className="w-full p-2 mb-2 border border-gray-300 rounded text-black" />
         </div>

         <div className="mb-2">
            <h2 className="text-lg font-semibold text-black mb-2">KML Color By</h2>
            <input type="text" placeholder="KML Color By" value={kmlColorBy} onChange={(e) => setKmlColorBy(e.target.value)} className="w-full p-2 mb-2 border border-gray-300 rounded text-black" />
         </div>

         <button onClick={handleApiCall} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
            {loading ? "Loading..." : "Get Data"}
         </button>

         <div className="mt-4">
            <h1 className="text-black">Total Earthquakes: {earthquakes.length}</h1>
         </div>
      </div>
   );
};

export default EarthquakeFilter;
