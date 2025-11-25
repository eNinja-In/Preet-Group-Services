/**
 * `checkAuth`: Function to check if the user is authenticated based on the token in localStorage.
 * It sends a request to a protected backend endpoint to verify the user's token.
 *
 * 1. `setIsAuth`: A setter function passed as an argument to update the authentication state in the parent component.
 * 2. `user`: Retrieves the user data stored in the browser's localStorage, which includes the token.
 * 3. `if (!user || !user.token)`: Checks if the user data or the token is missing from localStorage. 
 *    If either is missing, it sets `setIsAuth(false)` to mark the user as unauthenticated.
 * 4. `fetch`: Sends a `GET` request to the backend endpoint `/api/auth/protected` with the `Authorization` header containing the Bearer token.
 * 5. `headers`: The `Authorization` header is used to authenticate the request using the Bearer token from localStorage.
 * 6. `await res.json()`: If the response is JSON, it waits for the server's response and extracts the JSON data.
 * 7. `contentType`: The function checks the `Content-Type` header of the response to determine if the server returned JSON or some other format (e.g., HTML).
 * 8. `if (contentType && contentType.includes("application/json"))`: This condition ensures that the response is in JSON format.
 * 9. `const rawResponse = await res.text()`: If the response is not JSON (e.g., an error page or HTML), it logs the raw response text for debugging.
 * 10. `throw new Error("Server did not return JSON")`: Throws an error if the response is not in JSON format, triggering the catch block.
 * 11. `if (data.success)`: If the backend returns `success: true`, it means the token is valid and the user is authenticated, so it sets `setIsAuth(true)`.
 * 12. `else`: If the token is invalid or the backend response indicates failure (e.g., `success: false`), it removes the user data from localStorage and sets `setIsAuth(false)`.
 * 13. `catch`: Catches any error that occurs during the `fetch` request, such as network issues, invalid responses, or server errors.
 * 14. `console.error("Authentication check failed:", error)`: Logs the error for debugging.
 * 15. `setIsAuth(false)`: If any error occurs (e.g., invalid token or network failure), the user is marked as unauthenticated by setting `setIsAuth(false)`.
 */
let isCheckingAuth = false;

export const checkAuth = async (setIsAuth) => {
  if (isCheckingAuth) return; // Prevent multiple calls while already checking auth
  isCheckingAuth = true;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) return setIsAuth(false);

  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_LINK}/api/auth/protected`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${user.token}` },
    });

    const contentType = res.headers.get("Content-Type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const rawResponse = await res.text();
      console.log('Raw response from server:', rawResponse);
      throw new Error("Server did not return JSON");
    }

    if (data.success) {
      setIsAuth(true);
    } else {
      localStorage.removeItem("user");
      setIsAuth(false);
    }
  } catch (error) {
    console.error("Authentication check failed:", error);
    setIsAuth(false);
  } finally {
    isCheckingAuth = false; // Allow next check after the current one is done
  }
};
