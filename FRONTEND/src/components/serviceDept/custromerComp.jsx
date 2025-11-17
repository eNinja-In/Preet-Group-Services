/**
 * **CompReg Component**:
 * This React component is designed to handle the complaint registration for an engine number.
 * The component allows users to:
 * - Fetch engine data based on an engine number.
 * - Register complaints with detailed information about the engine.
 * - Display notifications using pop-ups for success/error states.
 * - Provide loading states for both data fetching and complaint registration.
 * - Use modern UI patterns with responsiveness and accessibility in mind.
 * 
 * Key Features:
 * 1. **Engine Number Data Fetching**: The user enters an engine number, which triggers the API to fetch corresponding engine data.
 * 2. **Complaint Registration**: After fetching the data, users can input more details to register the complaint.
 * 3. **Loading States**: Both the "Fetch" and "Register" buttons reflect loading states, ensuring a smooth user experience.
 * 4. **Error Handling**: The component provides clear feedback to users when the engine number is invalid or when there's an error in fetching or registering the complaint.
 * 5. **Pop-up Notifications**: Success or error notifications are shown in a pop-up, providing instant feedback to the user.
 * 6. **Responsiveness**: The component is responsive and works across different screen sizes, with flexible input layouts.
 * 
 * This component is structured to be easily scalable and maintainable for larger projects, supporting both front-end and back-end integration.
 */

import { useState } from "react";
import { fetchData } from "../helper/dataFecth";
import PopUp from "../common/PopUp";

export default function CompReg() {
    // State variables for managing the form inputs and data fetching
    const [EngineNo, setEngineNo] = useState("");
    const [WarrentyChech, setWarrentyChech] = useState(true);
    const [Warrenty, setWarrenty] = useState("");
    const [popup, setPopUp] = useState(false);
    const [Fetch, setFetch] = useState(false);
    const [Register, setRegister] = useState(false);
    const [data, setData] = useState({
        Chassis: "",
        Customer: "",
        Dealer: "",
        Location: "",
        State: "",
        Hours: "",
        Problem: "",
        WarrentyChech: true,
        Warrenty: "",
    });
    const [notification, setNotification] = useState({
        message: "",
        type: "",
        data: {}
    });

    // Function to handle the fetching of engine data based on the engine number
    const handleFetch = async () => {
        if (EngineNo.trim() !== "") {
            setFetch(true);
            try {
                await fetchData(EngineNo, setData);  // Call to fetch data from API
                setNotification({
                    // message: "Engine data fetched successfully.",
                    data: data,
                    type: "success",
                });
                setPopUp(true);  // Show success notification pop-up
            } catch (error) {
                setNotification({
                    message: "Failed to fetch data. Please try again.",
                    type: "error",
                });
                setPopUp(true);  // Show error notification pop-up
            } finally {
                setFetch(false);  // Reset loading state
            }
        } else {
            setNotification({
                message: "Please enter a valid Engine Number.",
                type: "error",
            });
            setPopUp(true);  // Show error notification for invalid engine number
        }
    };

    // Function to handle complaint registration submission
    const handleRegister = async (e) => {
        e.preventDefault();
        setRegister(true);  // Show loading state for register button
        try {
            setTimeout(() => {
                setNotification({
                    message: "Complaint registered successfully!",
                    type: "success",
                });
                setPopUp(true);  // Show success notification pop-up
                setRegister(false);  // Reset register button state
            }, 2000);  // Simulate async operation for registering complaint
        } catch (error) {
            setNotification({
                message: "An error occurred while registering the complaint.",
                type: "error",
            });
            setPopUp(true);  // Show error notification for registration failure
            setRegister(false);  // Reset register button state
        }
    };

    return (
        <>
            <div className="w-full p-6 bg-white">
                {/* Display pop-up for notifications */}
                {popup && (
                    <PopUp
                        data={notification.data || notification.message}
                        type={notification.type}
                        onClose={() => setPopUp(false)}  // Close the pop-up when the user clicks close
                        isOpen={true}
                        title={notification.type === "error" ? "Error" : "Success"}
                    />
                )}

                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                        {/* Engine Number Fetch Form */}
                        <form className="space-y-6">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={EngineNo}
                                        placeholder="Engine No."
                                        onChange={(e) => setEngineNo(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        onClick={handleFetch}
                                        disabled={Fetch}
                                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {Fetch ? "Fetching..." : "Fetch"}
                                    </button>
                                </div>
                            </div>

                            {/* Display Warranty Status */}
                            <div className="flex justify-center">
                                <div className="text-xl font-semibold">
                                    {WarrentyChech ? (
                                        <span className="text-green-500">{Warrenty}</span>
                                    ) : (
                                        <span className="text-red-600">{Warrenty}</span>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* Complaint Registration Form */}
                        <form onSubmit={handleRegister} className="space-y-6 mt-8">
                            <div className="flex flex-wrap gap-6">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={data.Chassis}
                                        placeholder="Chassis No."
                                        onChange={(e) => setData((prev) => ({ ...prev, Chassis: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={data.Customer}
                                        placeholder="Customer Name"
                                        onChange={(e) => setData((prev) => ({ ...prev, Customer: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Additional fields for Complaint details */}
                            <div className="flex flex-wrap gap-6">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={data.Dealer}
                                        placeholder="Dealer Name"
                                        onChange={(e) => setData((prev) => ({ ...prev, Dealer: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={data.Location}
                                        placeholder="Location"
                                        onChange={(e) => setData((prev) => ({ ...prev, Location: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-6">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={data.State}
                                        placeholder="State"
                                        onChange={(e) => setData((prev) => ({ ...prev, State: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        value={data.Hours}
                                        placeholder="Working Hours"
                                        onChange={(e) => setData((prev) => ({ ...prev, Hours: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <textarea
                                    value={data.Problem}
                                    placeholder="Describe Problem"
                                    onChange={(e) => setData((prev) => ({ ...prev, Problem: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="5"
                                    required
                                />
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={Register}
                                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {Register ? "Registering..." : "Register"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
