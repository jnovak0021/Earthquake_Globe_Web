import { useState } from "react";

interface User {
   id: number;
   name: string;
   email: string;
}

export default function Login({ setIsLoggedIn, setUser }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; setUser: React.Dispatch<React.SetStateAction<User | null>> }) {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [name, setName] = useState(""); // Name state for sign-up
   const [isCreatingAccount, setIsCreatingAccount] = useState(false); // Toggle between login & sign-up
   const [accountCreated, setAccountCreated] = useState(false); // Track if account creation is successful
   const [errorMessage, setErrorMessage] = useState(""); // Error message state

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
         const response = await fetch("http://localhost:8080/api/go/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
         });

         const data = await response.json();
         if (response.ok) {
            setUser({ id: data.id, name: data.name, email: data.email }); // Store user info
            setIsLoggedIn(true); // Mark user as logged in
         } else {
            setErrorMessage(data.message || "Invalid email or password.");
         }
      } catch (error) {
         console.error("Error:", error);
         setErrorMessage("Something went wrong!");
      }
   };

   const handleCreateAccount = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email || !password || !name) {
         setErrorMessage("Please fill out all fields.");
         return;
      }

      try {
         const response = await fetch("http://localhost:8080/api/go/users", {
            method: "POST", // Same as login but POST for user creation
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
         });

         const data = await response.json();
         if (response.ok) {
            setAccountCreated(true);
            setErrorMessage(""); // Clear errors
         } else {
            setErrorMessage(data.message || "Failed to create account.");
         }
      } catch (error) {
         console.error("Error:", error);
         setErrorMessage("Something went wrong!");
      }
   };

   return (
      <div className="bg-black bg-opacity-50 p-8 rounded-lg space-y-6 w-full max-w-md z-10">
         <h2 className="text-2xl font-bold text-white text-center">{isCreatingAccount ? "Create Account" : "Login"}</h2>

         {accountCreated ? (
            <div className="space-y-4">
               <p className="text-center text-lg font-bold text-green-400">Account created successfully!</p>
               <button
                  onClick={() => {
                     setIsCreatingAccount(false);
                     setAccountCreated(false);
                  }}
                  className="w-full p-3 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
               >
                  Back to Login
               </button>
            </div>
         ) : (
            <form onSubmit={isCreatingAccount ? handleCreateAccount : handleLogin} className="space-y-4">
               {isCreatingAccount && <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white" />}
               <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white" />
               <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white" />
               <button type="submit" className="w-full p-3 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
                  {isCreatingAccount ? "Create Account" : "Sign In"}
               </button>
            </form>
         )}

         {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

         {!accountCreated && (
            <div className="text-center text-sm text-gray-400">
               <a href="#" onClick={() => setIsCreatingAccount((prev) => !prev)} className="hover:underline">
                  {isCreatingAccount ? "Already have an account? Sign In" : "Create Account"}
               </a>
            </div>
         )}
      </div>
   );
}
