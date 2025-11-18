/**
 * AdminAuth Component
 * 
 * This component renders an Admin Login form. It allows an admin to log in using an 
 * admin code and passkey. It fetches the admin's name from `localStorage` (if available) 
 * and uses it in the form. On form submission, it makes a POST request to validate the login 
 * credentials against the backend server.
 * 
 * Key Features:
 * 1. Fetches admin data (name) from localStorage.
 * 2. Allows the admin to input admin code and passkey.
 * 3. Sends a POST request to the server to verify credentials.
 * 4. Displays error messages or redirects upon successful login.
 * 5. Includes loading state to prevent multiple submissions.
 * 6. Uses TailwindCSS for styling, with responsive and modern design.
 * 
 * Dependencies:
 * - React (useState, useEffect, useNavigate)
 * - TailwindCSS (for styling)
 * - Fetch API for server requests
 * 
 * Functionalities:
 * 1. Displays the login form with input fields for the admin code and passkey.
 * 2. Sends a POST request with the form data to the backend server for verification.
 * 3. On success, redirects to the homepage. On failure, shows error messages.
 * 4. Shows a loading state while awaiting the server response.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdminRequest } from "../helper/authHelper";

export default function AdminAuth() {
    const auth = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const [name, setName] = useState(auth?.user?.name || "");
    const [adminCode, setAdminCode] = useState("");
    const [passKey, setPassKey] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!auth || !auth.user || !auth.user.id) {
            navigate("/login");
        }
    }, [auth, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!adminCode || !passKey) {
            setError("Please fill in all fields.");
            return;
        }

        const result = await loginAdminRequest(auth, adminCode, passKey, setError, setLoading);
        if (result) { navigate("/"); }
    };

    return (
        <div className="w-screen h-screen bg-black opacity-80 flex justify-center items-center fixed top-0 left-0">
            <div className="sm:w-1/3 min-w-fit bg-white rounded-2xl border-8 border-blue-500 flex">
                <form onSubmit={handleSubmit} className="w-full h-full flex flex-col p-8">
                    <h1 className="text-3xl font-bold text-center mb-6">PREET ADMIN LOGIN</h1>

                    {/* Display error message if any */}
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    {/* Form input fields */}
                    <div className="flex flex-col items-center mb-6 space-y-4">
                        <input
                            type="text"
                            className="w-full p-3 text-lg border-2 border-black rounded-md"
                            placeholder="Admin Name"
                            value={name.toUpperCase()}
                            readOnly
                        />
                        <input
                            type="text"
                            className="w-full p-3 text-lg border-2 border-black rounded-md"
                            placeholder="Admin Code"
                            value={adminCode.toUpperCase()}
                            onChange={(e) => setAdminCode(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            className="w-full p-3 text-lg border-2 border-black rounded-md"
                            placeholder="Admin Passkey"
                            value={passKey}
                            onChange={(e) => setPassKey(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-2/5 py-3 mx-auto text-xl font-semibold text-white bg-blue-700 rounded-lg hover:bg-white hover:text-black border-2 border-blue-700 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
