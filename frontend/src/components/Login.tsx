import { useState } from "react";

export default function Login({ setIsLoggedIn }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }) {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [name, setName] = useState(""); // Added name state
   const [isCreatingAccount, setIsCreatingAccount] = useState(false);
   const [accountCreated, setAccountCreated] = useState(false); // Track account creation
   const [errorMessage, setErrorMessage] = useState("");

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Logging in with:", email, password);

      try {
         const response = await fetch("http://localhost:8080/api/go/login", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
         });

         const data = await response.json();
         if (response.ok) {
            console.log("Login successful:", data);
            setIsLoggedIn(true); // Set the login status to true
         } else {
            setErrorMessage(data.message || "Login failed");
         }
      } catch (error) {
         console.error("Error:", error);
         setErrorMessage("Something went wrong!");
      }
   };

   const handleCreateAccount = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Creating account with:", email, password, name);

      try {
         const response = await fetch("http://localhost:8080/api/go/users", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }), // Include name in request
         });

         const data = await response.json();
         if (response.ok) {
            console.log("Account created successfully:", data);
            setAccountCreated(true); // Show success message
         } else {
            setErrorMessage(data.message || "Error creating account");
         }
      } catch (error) {
         console.error("Error:", error);
         setErrorMessage("Something went wrong!");
      }
   };

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
         <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800">{isCreatingAccount ? "Create Account" : "Login"}</h2>

            {accountCreated ? (
               <div className="space-y-4">
                  <p className="text-center text-lg font-bold text-blue-600">Account created successfully!</p>
                  <a
                     href="#"
                     onClick={() => {
                        setIsCreatingAccount(false);
                        setAccountCreated(false);
                     }}
                     className="block text-center text-sm text-blue-600 hover:underline"
                  >
                     Back to Login
                  </a>
               </div>
            ) : (
               <form onSubmit={isCreatingAccount ? handleCreateAccount : handleLogin} className="space-y-4">
                  {isCreatingAccount && <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />}

                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />

                  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />

                  <button type="submit" className="w-full p-3 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
                     {isCreatingAccount ? "Create Account" : "Sign In"}
                  </button>
               </form>
            )}

            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

            <div className="flex justify-between text-sm text-gray-600">
               <a href="#" className="hover:underline">
                  Forgot Password?
               </a>
               <a href="#" className="hover:underline" onClick={() => setIsCreatingAccount((prev) => !prev)}>
                  {isCreatingAccount ? "Already have an account? Sign In" : "Create Account"}
               </a>
            </div>
         </div>
      </div>
   );
}
