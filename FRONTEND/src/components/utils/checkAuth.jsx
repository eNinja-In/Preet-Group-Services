// 1. `checkAuth`: Function to check if the user is authenticated based on the token in localStorage.
// 2. `setIsAuth`: A setter function passed as an argument to update the authentication state in the parent component.
// 3. `token = localStorage.getItem("token")`: Retrieves the token stored in the browser's localStorage.
// 4. `if (!token)`: Checks if the token is missing from localStorage. If it's missing, sets `setIsAuth(false)` to mark as unauthenticated.
// 5. `fetch`: Sends a `GET` request to the backend endpoint `/api/auth/protected` with the `Authorization` header containing the Bearer token.
// 6. `headers`: The `Authorization` header includes the Bearer token to authenticate the request.
// 7. `await res.json()`: Waits for the response from the server and extracts the JSON response.
// 8. `if (success)`: If the server returns `success: true`, then it means the token is valid, so `setIsAuth(true)` marks the user as authenticated.
// 9. `setIsAuth(false)`: If the token is invalid or `success` is not `true`, sets `setIsAuth(false)` to mark the user as unauthenticated.
// 10. `catch`: Catches any error that occurs during the fetch request, such as network issues or server errors.
// 11. `console.error`: Logs the error to the console for debugging.
// 12. `setIsAuth(false)`: If there is an error in checking authentication (like network failure), the user is marked as unauthenticated.

export const checkAuth = async (setIsAuth) => {
    const token = localStorage.getItem("token");
    if (!token) return setIsAuth(false);

    try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_LINK}/api/auth/protected`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });

        const { success } = await res.json();
        if (success) return setIsAuth(true);

        localStorage.removeItem("user");
        setIsAuth(false);

    } catch (error) {
        console.error("Authentication check failed:", error);
        // localStorage.removeItem("user");
        setIsAuth(false);
    }
};
