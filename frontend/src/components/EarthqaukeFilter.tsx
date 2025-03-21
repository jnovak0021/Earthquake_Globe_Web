import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "./EarthquakeWarningPopup";

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
  saveUserPreferences: (
    email: string,
    startTime: string,
    endTime: string,
    minMagnitude: number,
    maxMagnitude: number,
    minDepth: number,
    maxDepth: number
  ) => Promise<void>;
  userEmail: string;
  savedPreferences: {
    start_time: string;
    end_time: string;
    min_mag: number;
    max_mag: number;
    min_depth: number;
    max_depth: number;
  } | null;
  updateUserPreferences: React.Dispatch<
    React.SetStateAction<{
      start_time: string;
      end_time: string;
      min_mag: number;
      max_mag: number;
      min_depth: number;
      max_depth: number;
    } | null>
  >;
}

// Function to format date correctly
const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  return dateString.split(" ")[0]; // Converts "yyyy-MM-dd HH:mm:ss" → "yyyy-MM-dd"
};

const EarthquakeFilter: React.FC<EarthquakeFilterProps> = ({
  onEarthquakesUpdate,
  saveUserPreferences,
  userEmail,
  savedPreferences,
  updateUserPreferences,
}) => {
  const [startTime, setStartTime] = useState("2020-01-01");
  const [endTime, setEndTime] = useState("2025-01-01");
  const [minMagnitude, setMinMagnitude] = useState(0);
  const [maxMagnitude, setMaxMagnitude] = useState(10);
  const [minDepth, setMinDepth] = useState(-100);
  const [maxDepth, setMaxDepth] = useState(1000);
  const [numEarthquakes, setNumEarthquakes] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [continueAnyways, setContinueAnyways] = useState(false);
  const [modalCount, setModalCount] = useState(0);


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

//   //function for getting data fromt he globe
//   const handleSelectionComplete = (minLat: number, minLng: number, maxLat: number, maxLng: number) => {
//    setMinLatitude(minLat);
//    setMinLongitude(minLng);
//    setMaxLatitude(maxLat);
//    setMaxLongitude(maxLng);
//    console.log("Selected Bounds in EarthquakeFilter:", { minLat, minLng, maxLat, maxLng });
//    // You can now use the selected bounds to filter earthquakes or perform other actions
//  };

  const fetchEarthquakeCount = async () => {
    const response = await axios.get(
      //"http://localhost:8080/api/go/earthquakes/count",
      //"https://earthquake-globe-web-0wajea.fly.dev/api/go/earthquakes/count",
      "https://earthquake-globe-web-backend.fly.dev/api/go/earthquakes/count",
      {
        params: {
          startTime,
          endTime,
          minMagnitude,
          maxMagnitude,
          minDepth,
          maxDepth,
        },
      }
    );
    const rawData = response.data;
    console.log("Earthquake count fetched:", rawData);

    const numEarthquakes = rawData.count;
    setModalCount(numEarthquakes);
    if (numEarthquakes > 3000 && !continueAnyways) {
      setIsModalOpen(true);
    } else {
      fetchEarthquakeJSON();
    }
  };

  const fetchEarthquakeJSON = async () => {
    try {
      const response = await axios.get(
        
        //"https://earthquake-globe-web-0wajea.fly.dev/api/go/earthquakes",
        //"http://localhost:8080/api/go/earthquakes",
        "https://earthquake-globe-web-backend.fly.dev/api/go/earthquakes",
        {
          params: {
            startTime,
            endTime,
            minMagnitude,
            maxMagnitude,
            minDepth,
            maxDepth,
          },
        }
      );

      onEarthquakesUpdate(response.data);
      setNumEarthquakes(response.data.length);
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
    }
  };

  const handleSavePreferences = async () => {
    await saveUserPreferences(
      userEmail,
      startTime,
      endTime,
      minMagnitude,
      maxMagnitude,
      minDepth,
      maxDepth
    );

    const updatedPreferences = {
      start_time: startTime,
      end_time: endTime,
      min_mag: minMagnitude,
      max_mag: maxMagnitude,
      min_depth: minDepth,
      max_depth: maxDepth,
    };

    // Save to `localStorage`
    localStorage.setItem(
      `preferences_${userEmail}`,
      JSON.stringify(updatedPreferences)
    );

    // Update UI instantly
    updateUserPreferences(updatedPreferences);
    console.log("Preferences saved and updated in UI:", updatedPreferences);
  };

  const handleContinueAnyways = () => {
    setContinueAnyways(true);
    setIsModalOpen(false);
    fetchEarthquakeJSON();
  };

  return (
   
   <div className="bg-gray-800 bg-opacity-80 z-50 p-4 rounded-lg shadow-lg">
      {/* Note about shift click */}
      <div className="mt-4">
        <p className="text-white text-sm italic">
          SHIFT + Click to select area
        </p>
      </div>
      {/* Start Time */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white-700">
          Start Time
        </label>
        <input
          type="date"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="bg-gray-800 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* End Time */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white-700">
          End Time
        </label>
        <input
          type="date"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="bg-gray-800 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Min Magnitude */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white-700">
          Min Magnitude
        </label>
        <input
          type="number"
          value={minMagnitude}
          onChange={(e) => setMinMagnitude(Number(e.target.value))}
          className="bg-gray-800 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Max Magnitude */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white-700">
          Max Magnitude
        </label>
        <input
          type="number"
          value={maxMagnitude}
          onChange={(e) => setMaxMagnitude(Number(e.target.value))}
          className=" bg-gray-800 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Min Depth */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white-700">
          Min Depth
        </label>
        <input
          type="number"
          value={minDepth}
          onChange={(e) => setMinDepth(Number(e.target.value))}
          className="bg-gray-800 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Max Depth */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white-700">
          Max Depth
        </label>
        <input
          type="number"
          value={maxDepth}
          onChange={(e) => setMaxDepth(Number(e.target.value))}
          className="bg-gray-800 block w-full px-3 py-2 border border-gray-300 rounded-md"
        /> 
      </div>
      {/* Update Earthquakes Button */}
      <button
        onClick={fetchEarthquakeCount}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Update Earthquakes
      </button>

      {/* Save Preferences Button */}
      <button
        onClick={handleSavePreferences}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2"
      >
        Save Preferences
      </button>

      {/* Display Total Earthquakes */}
      <div className="mt-4">
        <h1 className="text-white">Total Earthquakes: {numEarthquakes}</h1>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onContinue={handleContinueAnyways}
        count={modalCount}
      >
      </Modal>
    </div>
  );
};

export default EarthquakeFilter;