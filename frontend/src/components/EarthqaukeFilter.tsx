import axios from "axios";
import React, { useState } from "react";

interface RawEarthquakeData {
   Id: string;
   Time: string;
   Latitude: string;
   Longitude: string;
   Depth: string;
   Mag: string;
   Place: string;
   Status: string;
 }

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
}

const EarthquakeFilter: React.FC<EarthquakeFilterProps> = ({ onEarthquakesUpdate }) => {
   const [startTime, setStartTime] = useState("2020-01-01");
   //const [minLatitude, setMinLatitude] = useState("0");
   //const [maxLatitude, setMaxLatitude] = useState("90");
   //const [minLongitude, setMinLongitude] = useState("0");
   //const [maxLongitude, setMaxLongitude] = useState("180");
   const [endTime, setEndTime] = useState("2025-01-01");
   const [minMagnitude, setMinMagnitude] = useState("0");
   const [maxMagnitude, setMaxMagnitude] = useState("10");
   const [minDepth, setMinDepth] = useState("-100");
   const [maxDepth, setMaxDepth] = useState("1000");
   const [numEarthquakes, setNumEarthquakes] = useState(0);
   

   // Function to transform raw data into Earthquake interface
   const transformData = (data: RawEarthquakeData[]): Earthquake[] => {
   return data.map(item => ({
      id: item.Id,
      time: item.Time,
      place: item.Place,
      latitude: parseFloat(item.Latitude),
      longitude: parseFloat(item.Longitude),
      depth: parseFloat(item.Depth),
      mag: parseFloat(item.Mag),
      status: item.Status
   }));
   };
   //method to query backend api api/go/earthquakes 
   //will send a json string a fetch a json string
   const fetchEarthquakeJSON = async () => {
      console.log("Fetching Earthquake JSON from backend");

      //list of parameters to pass into the backend api

      try {
         const response = await axios.get("http://localhost:8080/api/go/earthquakes?startTime=" + startTime + "&endTime=" + endTime + "&minMagnitude=" + minMagnitude + "&maxMagnitude=" + maxMagnitude + "&minDepth=" + minDepth + "&maxDepth=" + maxDepth);
         const rawData = response.data;

         const earthquakes = transformData(rawData);
         console.log(earthquakes.length);
         console.log(rawData);

         onEarthquakesUpdate(rawData);
         setNumEarthquakes(0);
      }
      catch (error) {
         console.error("Error fetching data:", error);
      }
      //convert date to timestamp in ms


      console.log("Earthquake data recieved, ");

      
      
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



/*import axios from "axios";
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
   

   const fetchEarthquakeJSON = async () => {
      console.log("fetchEarthquakeJSON");

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
            {/* {loading ? "Loading..." : "Get Data"} 
            Update Earthquakes
         </button>
         {/* <button onClick={handleApiCall} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
            {loading ? "Loading..." : "Get Data"}
         </button> 

         <div className="mt-4">
            <h1 className="text-black">Total Earthquakes: ${numEarthquakes}</h1>
         </div>
      </div>
   );
};

export default EarthquakeFilter;
*/