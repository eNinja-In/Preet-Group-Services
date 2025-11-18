/**
 * LoginUser Function
 * 
 * This function is responsible for handling the login request for a user. It sends a POST 
 * request to the backend server with the user's `empCode` and `password`, and processes 
 * the response to handle success or failure. If the login is successful, it returns the result.
 * If the login fails or an error occurs, it sets an error message using `setError`.
 * 
 * Key Features:
 * 1. Sends a POST request to the backend to authenticate the user with `empCode` and `password`.
 * 2. Handles both server-side errors and unexpected errors with appropriate messages.
 * 3. Updates the loading state using `setLoading` to indicate that the login request is in progress.
 * 4. Returns the login result on success, and `null` on failure.
 * 5. If successful, the result will be used to proceed with further actions (e.g., redirecting the user).
 * 
 * Dependencies:
 * - Fetch API for sending HTTP requests.
 * - `setError`: Function to set error messages if the login fails.
 * - `setLoading`: Function to update the loading state.
 * 
 * @param {string} empCode - The employee code used for user identification.
 * @param {string} password - The password provided by the user for authentication.
 * @param {function} setError - A function to set the error message in the component.
 * @param {function} setLoading - A function to update the loading state during the request.
 * 
 * @returns {object|null} - Returns the login result on success, or null if the login failed.
 */

export async function LoginUser(empCode, password, setError, setLoading) {
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

        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.message || "Login failed. Please try again.");
            return null; // Early return on failure
        }

        const result = await response.json();

        if (result.success) { return result; }
        else {
            setError(result.message || "Login failed. Please try again.");
            return null;
        }

    } catch (error) {
        setError("An unexpected error occurred. Please try again later.");
        return null;
    } finally { setLoading(false); }
}



/**
 * loginAdminRequest Function
 * 
 * This function is responsible for handling the login request for an admin user. 
 * It sends a POST request to the backend server to authenticate the admin with 
 * their `adminCode` and `passKey`. It also includes the user's ID (from the 
 * `auth` object) to identify the admin. The function updates the UI with loading 
 * and error states, and processes the server's response to either return the 
 * result or set an error message.
 * 
 * Key Features:
 * 1. Resets any previous error message by calling `setError("")`.
 * 2. Sends a POST request to the server with the admin's credentials (`adminCode` and `passKey`).
 * 3. Handles the server's response, returning the result if login is successful, or throwing an error if not.
 * 4. Catches any errors during the request (e.g., network errors) and sets a relevant error message.
 * 5. Uses a loading state to indicate that the request is in progress.
 * 
 * Dependencies:
 * - Fetch API for sending the HTTP POST request.
 * - `setError`: Function to set the error message in the component state.
 * - `setLoading`: Function to update the loading state.
 * 
 * @param {object} auth - The authenticated user object, which contains the user's ID.
 * @param {string} adminCode - The code provided by the admin to authenticate.
 * @param {string} passKey - The passkey provided by the admin for authentication.
 * @param {function} setError - Function to set an error message if the login fails.
 * @param {function} setLoading - Function to update the loading state during the request.
 * 
 * @returns {object|null} - Returns the login result on success, or null if the login fails.
 */
export async function loginAdminRequest(auth, adminCode, passKey, setError, setLoading) {
    setError("");
    setLoading(true);

    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_LINK}/api/auth/login-admin`, {
            method: "POST",
            body: JSON.stringify({
                _id: `${auth.user.id}`,
                adminCode,
                adminKey: passKey,
            }),
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (response.ok && result.success) { return result; }
        else { throw new Error(result.message || "Login failed. Please try again."); }

    } catch (error) {
        setError(error.message || "An unexpected error occurred. Please try again later.");
        return null;
    } finally { setLoading(false); }
}
