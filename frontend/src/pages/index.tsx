import Globe from "@/components/Globe";
import EarthquakeFilter from "@/components/EarthqaukeFilter";
import Login from "@/components/Login";
import { useState } from "react";

export default function Index() {
   const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status

   return (
      <div className="min-h-screen w-full bg-blue-900 flex justify-center items-center">
         <Globe />
         {/* {!isLoggedIn ? (
            <Login setIsLoggedIn={setIsLoggedIn} />
         ) : (
            // After Login - Globe & Earthquake Filter layout
            <div className="flex w-full h-full">
               {/* Globe Section */}
               <div className="flex-grow relative">
                  <h3 className="text-lg font-semibold text-white text-center absolute top-5 left-0 right-0">Interactive Globe</h3>
                  <div className="overflow-auto w-full h-full">
                     <Globe />
                  </div>
               </div>

               {/* Earthquake Filter Tab 
               <div className="w-80 bg-gray-200 p-4 rounded-lg shadow-md flex-shrink-0">
                  <EarthquakeFilter />
               </div>
            </div>
         )} */}
      </div>
   );
}
