import Globe from "@/components/Globe";
import EarthquakeFilterDropdown from "@/components/EarthquakeFilterDropdown"; // Import dropdown component
//import Login from "@/components/Login";
//import { useState } from "react";

export default function Index() {
   //const [isLoggedIn, setIsLoggedIn] = useState(false);

   return (

      <div className="min-h-screen w-full flex justify-center items-center transition-all duration-500">
         {/* Globe Section (Full screen on both login and after login) */}
         <div className="absolute top-0 left-0 w-full h-full z-0">
            <Globe />
         </div>

         {/* Login or Earthquake Filter Section */}
         {/* {!isLoggedIn ? ( */}
            <div className="flex justify-center items-center z-10 w-full h-full">
               {/* <Login setIsLoggedIn={setIsLoggedIn} setUser={() => {}} /> */}
            </div>

         {/* ) : ( */}
            <div className="flex w-full h-screen z-10">
               {/* Globe Section */}
               <div className="flex-grow relative flex items-center justify-center">
                  <h3 className="text-lg font-semibold text-white absolute top-5 left-0 right-0 text-center">Interactive Globe</h3>
                  <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] transition-all duration-700">
                     <Globe />
                  </div>
               </div>


               {/* Earthquake Filter Dropdown (Top Right) */}
               <div className="absolute top-5 right-5 z-20">
                  <EarthquakeFilterDropdown />
               </div>
            </div>
         {/* )}  */}
      </div>
   );
}
