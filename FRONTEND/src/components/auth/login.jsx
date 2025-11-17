/**
 * Login Component
 * 
 * This component is designed for user login. It allows users to enter their 
 * `UserID` and `Password` to authenticate via a POST request to the backend API. 
 * If successful, it saves the user data to `localStorage` and redirects to the homepage.
 * 
 * Key Features:
 * 1. Accepts `UserID` and `Password` as inputs.
 * 2. Sends a POST request to the backend server for login verification.
 * 3. Displays error messages if login fails.
 * 4. Shows a loading state while waiting for the server's response.
 * 5. On success, redirects the user to the homepage.
 * 6. Uses TailwindCSS for styling, creating a responsive and modern design.
 * 
 * Functionalities:
 * 1. Allows users to input `UserID` and `Password`.
 * 2. Sends the input values to the backend server.
 * 3. If login is successful, stores the user data in `localStorage` and redirects.
 * 4. If login fails, shows an error message.
 * 5. Displays a loading state during the login process.
 * 
 * Dependencies:
 * - React (useState, useEffect)
 * - TailwindCSS (for styling)
 * - Fetch API for server requests
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [empCode, setEmpCode] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    document.title = "LOGIN PREET GROUPS";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_LINK}/api/auth/login-user`,
                {
                    method: "POST",
                    body: JSON.stringify({ empCode, password }),
                    headers: { "Content-Type": "application/json" },
                }
            );

            const result = await response.json();
            if (response.ok && result.success) {
                localStorage.setItem("user", JSON.stringify(result));
                navigate("/"); // Redirect on successful login
            } else {
                setError(result.message || "Login failed. Please try again.");
            }
        } catch (error) {
            setError("An unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-80 flex justify-center items-center">
            <div className="w-1/2 h-1/2 bg-white rounded-2xl border-8 border-green-500 flex flex-col justify-center items-center p-6">
                <h1 className="text-xl text-center font-semibold mb-4">PREET GROUPS SERVICES</h1>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-4">
                    <div className="w-11/12">
                        <input
                            type="text"
                            value={empCode}
                            placeholder="UserID"
                            onChange={(e) => setEmpCode(e.target.value)}
                            required
                            className="w-full p-3 text-lg border-2 border-black rounded-md"
                        />
                    </div>

                    <div className="w-11/12">
                        <input
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 text-lg border-2 border-black rounded-md"
                        />
                    </div>

                    <div className="w-11/12 flex justify-center">
                        <button
                            type="submit"
                            className="w-2/5 p-3 text-lg bg-green-600 text-white font-bold rounded-lg border-2 border-green-600 hover:bg-white hover:text-green-600 transition"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
