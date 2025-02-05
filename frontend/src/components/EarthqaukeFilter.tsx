import axios from "axios";
import React, { useState } from "react";

interface Earthquake {
   properties: {
      place: string;
      mag: number;
      depth?: number;
      time: number;
      geometry: {
         coordinates: number[];
      };
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
   const [numEarthquakes, setNumEarthquakes] = useState(0);
   //const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
   //const [loading, setLoading] = useState(false);

   
   // const fetchPageData = async (offset: number, limit: number): Promise<Earthquake[]> => {
   //    const response = await fetch(
   //       //'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson'
   //       `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=${minMagnitude}&maxmagnitude=${maxMagnitude}&mindepth=${minDepth}&maxdepth=${maxDepth}&offset=${offset}&limit=${limit}`
   //    );
   //    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

   //    const data = await response.json();
   //    return data.features || [];
   // };

   // const fetchAllData = async (): Promise<Earthquake[]> => {
   //    const limit = 50;
   //    let offset = 1;
   //    let allData: Earthquake[] = [];
   //    let hasMoreData = true;

   //    while (hasMoreData) {
   //       const promises = [];
   //       for (let i = 0; i < 10; i++) {
   //          promises.push(fetchPageData(offset + i * limit, limit));
   //       }

   //       const results = await Promise.all(promises);
   //       const newData = results.flat();
   //       allData = allData.concat(newData);

   //       if (newData.length < limit * 10) {
   //          hasMoreData = false;
   //       } else {
   //          offset += limit * 10;
   //       }
   //    }

   //    return allData;
   // };

   // const handleApiCall = async () => {
   //    setLoading(true);
   //    try {
   //       const allData = await fetchAllData();
   //       setEarthquakes(allData);
   //       onEarthquakesUpdate(allData);
   //    } catch (error) {
   //       console.error(error);
   //    } finally {
   //       setLoading(false);
   //    }
   // };

   const fetchEarthquakeJSON = async () => {
      console.log("fetchEarthquakeJSON");
      /*

      import datetime

      timestamp_ms = 1580513853232
      timestamp_s = timestamp_ms / 1000  # Convert milliseconds to seconds

      datetime_object = datetime.datetime.fromtimestamp(timestamp_s)

      date_string = datetime_object.strftime("%Y-%m-%d")

      print(date_string)  # Output: 2020-01-02

      */
      //convert date to timestamp in ms
      const response = await axios.get('/earthquake_data_2020_2025.json');
      const earthquakes = response.data;

      console.log("got response now filtering");
      const filteredEarthquakes = earthquakes.filter((earthquake: Earthquake) => {
         const magnitude = earthquake.properties.mag;
         const depth = earthquake.geometry ? earthquake.geometry.coordinates[2] : 0;
         const time = new Date(earthquake.properties.time).toISOString().split('T')[0];


         return (
            magnitude >= parseFloat(minMagnitude) &&
            magnitude <= parseFloat(maxMagnitude) &&
            depth >= parseFloat(minDepth) &&
            depth <= parseFloat(maxDepth) &&
            time >= startTime &&
            time <= endTime
         );
      });
      console.log("data filtered");
      setNumEarthquakes(parseInt(filteredEarthquakes.length));
      
      onEarthquakesUpdate(filteredEarthquakes);
      console.log("earthquake updated");

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

         <button onClick={fetchEarthquakeJSON} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            {/* {loading ? "Loading..." : "Get Data"} */}
            Update Earthquakes
         </button>
         {/* <button onClick={handleApiCall} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
            {loading ? "Loading..." : "Get Data"}
         </button> */}

         <div className="mt-4">
            <h1 className="text-black">Total Earthquakes: ${numEarthquakes}</h1>
         </div>
      </div>
   );
};

export default EarthquakeFilter;
