import { useEffect, useState, useCallback } from "react";
import PopUp from "../common/PopUp";
import { FetAttend, RegAttend } from "../helper/attendHelper";

/**
 * Defines the structure for the state data.
 */
const initialDataState = {
    name: "",
    engineNo: "",
    contact: "",
    location: "",
    state: "",
    date: "",
    problem: "",
};

export default function Attendance() {
    const [empCode, setEmpCode] = useState("");
    const [fetching, setFetching] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showLastLocationPopup, setShowLastLocationPopup] = useState(false);
    const [error, setError] = useState(null); // Changed to null for clearer error state
    
    // Stores the latest *fetched* employee data (for popup/history)
    const [lastFetchedData, setLastFetchedData] = useState(initialDataState);
    
    // Stores the data being *submitted* today (for the form inputs)
    const [dailyFormData, setDailyFormData] = useState(initialDataState);


    // Initializes today's date in DD/MM/YYYY format and sets it in the form data
    useEffect(() => {
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
            now.getMonth() + 1
        ).padStart(2, "0")}/${now.getFullYear()}`;

        setDailyFormData((prev) => ({ ...prev, date: formattedDate }));
    }, []);

    // Helper to update form data
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setDailyFormData((prev) => ({ ...prev, [name]: value }));
    };


    /**
     * Handles fetching employee data using the employee code.
     */
    const handleFetch = useCallback(async () => {
        setError(null);

        if (!empCode.trim()) {
            setError("Please enter a valid Employee Code.");
            return;
        }

        setFetching(true);
        try {
            // The helper now returns the data or throws an error
            const fetchedData = await FetAttend(empCode.trim());
            
            // 1. Set data for the Last Location Popup
            setLastFetchedData(fetchedData); 
            
            // 2. Pre-fill the submission form with Name, Contact, and Date
            setDailyFormData(prev => ({ 
                ...prev, 
                name: fetchedData.name,
                contact: fetchedData.contact,
                // Keep the existing date initialized in useEffect
            })); 

            // 3. Show the popup with the last location data
            setShowLastLocationPopup(true);

        } catch (e) {
            console.error("Fetch Error:", e);
            setError(e.message || "Unable to fetch attendance data. Try again later.");
        } finally {
            setFetching(false);
            // setEmpCode(""); // Clear the input after fetching attempt
        }
    }, [empCode]);


    /**
     * Handles the submission of the daily attendance form.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic form validation check
        if (!dailyFormData.name || !dailyFormData.location || !dailyFormData.date) {
            setError("Name, Location, and Date are required fields.");
            return;
        }

        setSubmitting(true);
        try {
            // Use the employee code from the last fetch or require it for the form
            // NOTE: If you need to enforce a *new* code for submission, adjust this.
            // For now, using a placeholder/default if empCode is empty (but better to use empCode from state or form).
            const submissionCode = empCode.trim() || lastFetchedData.engineNo;

            if (!submissionCode) {
                throw new Error("Employee Code is missing for submission.");
            }

            // RegAttend now handles the API call and returns a success result or throws an error
            await RegAttend(submissionCode, dailyFormData);
            
            // Success: Clear the form and notify the user
            setDailyFormData(prev => ({ 
                ...initialDataState, 
                // Re-initialize the date after successful submission
                date: prev.date, 
            })); 
            setEmpCode(""); // Clear empCode input
            setLastFetchedData(initialDataState); // Clear last fetched data
            setError("✅ Attendance Submitted Successfully!");


        } catch (e) {
            console.error("Submission Error:", e);
            setError(e.message || "Attendance submission failed. Please check the details and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
            
            {/* Popup for Last Location Data */}
            {showLastLocationPopup && (
                <PopUp
                    data={lastFetchedData}
                    Click={setShowLastLocationPopup}
                    title="Employee Last Location"
                />
            )}

            {/* Error/Success Popup */}
            {error && (
                <PopUp
                    data={error}
                    Click={setError}
                    title={error.startsWith("✅") ? "Success" : "Error"}
                    isError={!error.startsWith("✅")} // Differentiate error from success message
                />
            )}

            {/* Main Card Container */}
            <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
                <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8">
                    🛠️ Employee Daily Attendance
                </h1>

                {/* FETCH SECTION */}
                <div className="w-full bg-blue-50 border border-blue-200 p-5 rounded-xl mb-8">
                    <label htmlFor="empCode" className="block text-lg font-semibold mb-2 text-gray-700">
                        Employee Code
                    </label>
                    <div className="flex gap-3 max-sm:flex-col">
                        <input
                            id="empCode"
                            type="text"
                            value={empCode.toUpperCase()}
                            placeholder="Enter Employee Code"
                            onChange={(e) => setEmpCode(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition duration-150"
                            disabled={fetching || submitting}
                        />
                        <button
                            type="button"
                            disabled={fetching || submitting || !empCode.trim()}
                            onClick={handleFetch}
                            className={`px-6 py-3 bg-blue-600 text-white font-bold rounded-lg transition duration-150 ease-in-out hover:bg-blue-700 active:scale-[0.98] ${
                                (fetching || submitting || !empCode.trim()) && "opacity-60 cursor-not-allowed"
                            }`}
                        >
                            {fetching ? "Fetching..." : "Fetch Employee Data"}
                        </button>
                    </div>
                </div>

                {/* FORM SECTION */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* Name Field (Pre-filled on fetch) */}
                    <input
                        type="text"
                        name="name"
                        value={dailyFormData.name}
                        placeholder="Employee Name"
                        onChange={handleFormChange}
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-150"
                        required
                    />

                    {/* Contact No Field (Pre-filled on fetch) */}
                    <input
                        type="tel" // Use tel for contact numbers
                        name="contact"
                        value={dailyFormData.contact}
                        placeholder="Contact No"
                        onChange={handleFormChange}
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-150"
                    />

                    {/* Location */}
                    <input
                        type="text"
                        name="location"
                        value={dailyFormData.location}
                        placeholder="Current Location"
                        onChange={handleFormChange}
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-150"
                        required
                    />

                    {/* State */}
                    <input
                        type="text"
                        name="state"
                        value={dailyFormData.state}
                        placeholder="Current State"
                        onChange={handleFormChange}
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-150"
                    />

                    {/* DATE (Read-only since it's set by useEffect) */}
                    <input
                        type="text"
                        name="date"
                        value={dailyFormData.date}
                        placeholder="DD/MM/YYYY"
                        readOnly // Make it read-only as it's set programmatically
                        className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 sm:col-span-2 cursor-not-allowed"
                    />

                    {/* PROBLEM */}
                    <textarea
                        name="problem"
                        value={dailyFormData.problem}
                        placeholder="Describe the Problem / Daily Task Details"
                        rows={4}
                        onChange={handleFormChange}
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 sm:col-span-2 transition duration-150"
                    />

                    {/* SUBMIT BUTTON */}
                    <div className="col-span-2 flex justify-center mt-4">
                        <button
                            type="submit"
                            disabled={submitting || fetching}
                            className={`w-48 py-3 bg-green-600 text-white font-bold rounded-lg transition duration-150 ease-in-out hover:bg-green-700 active:scale-[0.98] ${
                                (submitting || fetching) && "opacity-60 cursor-not-allowed"
                            }`}
                        >
                            {submitting ? "Submitting..." : "Submit Attendance"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}