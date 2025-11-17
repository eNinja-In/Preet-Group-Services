/**
 * Error Component
 * 
 * This component dynamically renders an error page based on the error code passed as a prop.
 * It supports common HTTP error codes (404, 500, 403, etc.) and displays a professional-looking 
 * error page with a message and an optional "Go Home" button. The component is responsive and 
 * fully customizable for various types of errors.
 * 
 * Props:
 * - code (optional): The HTTP status code (default is 404).
 * - message (optional): A custom error message. If not provided, a default message will be shown.
 * 
 * Features:
 * - Displays the error code (e.g., 404) in a large, bold font.
 * - Provides a default message for common HTTP error codes.
 * - Allows for a custom error message if provided.
 * - Includes a button to redirect the user to the homepage.
 * - Fully responsive, looks great on both desktop and mobile.
 * 
 * Example Usage:
 * <Error code={404} /> // Displays 404 - Page Not Found
 * <Error code={500} message="Server Error" /> // Displays 500 with a custom message
 */
export default function Error({ code = 404, message }) {
    const defaultMessages = {
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Page Not Found",
        500: "Internal Server Error",
        503: "Service Unavailable",
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-gray-100 px-2">
            {/* Error Code: Displays the error code dynamically, default to 404 */}
            <h1 className="text-9xl font-extrabold text-gray-800">{code}</h1>

            {/* Error Message: Displays the custom or default error message */}
            <p className="mt-4 text-2xl text-gray-600"> {message || defaultMessages[code] || "Something went wrong"} </p>

            {/* Optional description: Provides more details about the error */}
            <p className="mt-2 text-gray-500 text-center max-w-xl"> Oops! The requested page encountered an error. You can go back to the homepage or contact support if the problem persists. </p>

            {/* Home Button: Button to navigate back to the homepage */}
            <button onClick={() => (window.location.href = "/")} className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors cursor-pointer" > Go Home </button>
        </div>
    );
}
