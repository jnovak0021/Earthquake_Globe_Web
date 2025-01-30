import UserInterface from "@/components/UserInterface";
import Globe from "@/components/Globe";
import Login from "@/components/Login";
import { useState } from "react";

export default function Index() {
   const [isLoggedIn] = useState(false);

   return (
      <div>
         {!isLoggedIn ? (
            <Login />
         ) : (
            <div className="mb-6">
               <h3 className="text-lg font-semibold text-white text-center">Interactive Globe</h3>
               <div className="overflow-auto max-h-96 border rounded-md" style={{ width: "100%", height: "300px" }}>
                  <Globe />
                  <h1>GLOBE</h1>
               </div>
               <UserInterface backendName="go" />
            </div>
         )}
      </div>
   );
}
