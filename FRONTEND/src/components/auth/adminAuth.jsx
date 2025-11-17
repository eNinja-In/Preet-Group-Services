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

export default function AdminAuth() {
    // Fetch the user data (admin name and id) from localStorage
    const auth = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    // State variables for the form fields and error handling
    const [name, setName] = useState("");
    const [adminCode, setAdminCode] = useState("");
    const [passKey, setPassKey] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Effect hook to pre-fill admin name from localStorage if available
    useEffect(() => {
        if (auth && auth.user && auth.user.name) {
            setName(auth.user.name); // Set the admin's name if it exists
        }
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setError(""); // Clear previous errors
        setLoading(true); // Set loading state to true when submitting

        try {
            // Send a POST request to the server with the admin credentials
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_LINK}/api/auth/login-admin`,
                {
                    method: "POST",
                    body: JSON.stringify({ _id: `${auth.user.id}`, adminCode, adminKey: passKey }),
                    headers: { "Content-Type": "application/json" },
                }
            );

            const result = await response.json(); // Parse the response from the server
            if (response.ok && result.success) {
                navigate("/"); // Redirect to home page on successful login
            } else {
                setError(result.message || "Login failed. Please try again."); // Show error message if login fails
            }
        } catch (error) {
            // Handle unexpected errors
            setError("An unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false); // Reset loading state after request is complete
        }
    };

    return (
        // Main container for the page (full-screen, centered form)
        <div className="w-[100vw] h-[100vh] top-0 left-0 bg-black bg-opacity-90 flex justify-center items-center fixed">
            {/* Form container with styling */}
            <div className="w-1/3 bg-white rounded-2xl border-8 border-blue-500 flex">
                <form className="w-full h-full flex flex-col p-8">
                    {/* Form title */}
                    <h1 className="text-3xl font-bold text-center mb-6">ADMIN LOGIN</h1>

                    {/* Error message display */}
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    {/* Form input fields for admin code and passkey */}
                    <div className="flex flex-col items-center mb-6 space-y-4">
                        <input
                            type="text"
                            className="w-11/12 p-4 text-lg border border-gray-300 rounded-md"
                            placeholder="EMPLOYEE"
                            value={name.toUpperCase()}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            className="w-11/12 p-4 text-lg border border-gray-300 rounded-md"
                            placeholder="ENTER ADMIN CODE"
                            value={adminCode.toUpperCase()}
                            onChange={(e) => setAdminCode(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            className="w-11/12 p-4 text-lg border border-gray-300 rounded-md"
                            placeholder="ADMIN PASSKEY"
                            value={passKey.toUpperCase()}
                            onChange={(e) => setPassKey(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        onClick={handleSubmit}
                        className="w-1/4 py-3 mx-auto text-xl font-semibold text-white bg-blue-700 rounded-lg hover:bg-white hover:text-black border-2 border-blue-700 transition-colors"
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? "Logging in..." : "Login"} {/* Change button text based on loading state */}
                    </button>
                </form>
            </div>
        </div>
    );
}
