import Globe from "@/components/Globe";
import EarthquakeFilter from "@/components/EarthqaukeFilter";
import Login from "@/components/Login";
import { useState } from "react";

export default function Index() {
   const [isLoggedIn, setIsLoggedIn] = useState(false); // Now we can update this state

   return (
      <div>
         {!isLoggedIn ? (
            <Login setIsLoggedIn={setIsLoggedIn} /> /* Pass the setIsLoggedIn function */
         ) : (
            <div className="mb-6">
               <h3 className="text-lg font-semibold text-white text-center">Interactive Globe</h3>
               <div className="overflow-auto max-h-96 border rounded-md" style={{ width: "100%", height: "300px" }}>
                  <Globe />
                  <h1>GLOBE</h1>
               </div>
               <EarthquakeFilter />
            </div>
         )}
      </div>
   );
}
