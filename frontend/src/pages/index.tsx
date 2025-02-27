import Globe from "@/components/Globe";
import EarthquakeFilterDropdown from "@/components/EarthquakeFilterDropdown";
import Login from "@/components/Login";
import { useState } from "react";
import axios from "axios";

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

export default function Index() {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
   const [userEmail, setUserEmail] = useState<string | null>(null); // Track userEmail

   // Function to handle updated earthquake data
   const handleEarthquakesUpdate = (newEarthquakes: Earthquake[]) => {
      setEarthquakes(newEarthquakes);
   };

   // Function to save user preferences when they apply a filter
   const handleSaveUserPreferences = async (email: string, startTime: string, endTime: string, minMagnitude: number, maxMagnitude: number, minDepth: number, maxDepth: number) => {
      if (email) {
         const requestData = {
            email,
            start_time: startTime,
            end_time: endTime,
            min_mag: minMagnitude,
            max_mag: maxMagnitude,
            min_depth: minDepth,
            max_depth: maxDepth,
         };

         console.log("Fixed Request data:", requestData); // Debugging

         try {
            await axios.post("http://localhost:8080/api/go/users/preferences", requestData);
            console.log("User preferences saved successfully!");
         } catch (error) {
            console.error("Error saving user preferences:", error);
         }
      }
   };

   // Filter earthquakes to only include those with valid lat/lng
   const validEarthquakes = earthquakes.filter((eq) => !isNaN(eq.latitude) && !isNaN(eq.longitude));

   return (
      <div className="min-h-screen w-full flex justify-center items-center transition-all duration-500">
         {/* Globe Section (Full screen on both login and after login) */}
         <div className="absolute top-0 left-0 w-full h-full z-0">
            <Globe earthquakes={validEarthquakes} />
         </div>

         {/* Login or Earthquake Filter Section */}
         {!isLoggedIn ? (
            <div className="flex justify-center items-center z-10 w-full h-full">
               {/* Pass setUserEmail when the user logs in */}
               <Login setIsLoggedIn={setIsLoggedIn} setUser={setUserEmail} />
            </div>
         ) : (
            <div className="flex w-full h-screen z-10">
               {/* Globe Section */}
               <div className="flex-grow relative flex items-center justify-center">
                  <h3 className="text-lg font-semibold text-white absolute top-5 left-0 right-0 text-center">Interactive Earthquake Globe</h3>
                  <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] transition-all duration-700">
                     <Globe earthquakes={validEarthquakes} />
                  </div>
               </div>

               {/* Earthquake Filter Dropdown (Top Right) */}
               <div className="absolute top-5 right-5 z-20">
                  {/* Pass userEmail */}
                  {userEmail && (
                     <EarthquakeFilterDropdown
                        onEarthquakesUpdate={handleEarthquakesUpdate}
                        userEmail={userEmail} // Pass userEmail
                        saveUserPreferences={handleSaveUserPreferences} // Pass the saveUserPreferences function
                     />
                  )}
               </div>
            </div>
         )}
      </div>
   );
}
