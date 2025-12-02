/**
 * CompReg Component:
 * This component manages the complaint registration process, including fetching engine data
 * and submitting detailed complaint information.
 * * NOTE: This version uses the ORIGINAL fetchData signature (which includes chassisNo in the call).
 */

import { useState } from "react";
// Assuming 'fetchData' and 'registerComplaint' are available in the helper file
import { fetchData, regComplaint } from "../../helper/complaintHelper"
import PopUp from "../../common/PopUp";

const initialComplaintData = {
    chassisNo: "",
    customerName: "",
    dealerName: "",
    contact: "",
    Location: "", // State key should match input 'name'
    state: "",
    Hours: "",
    Problem: "",
};

export default function CompReg() {
    // State for Engine Number input and fetching status
    const [engineNo, setEngineNo] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    // State for Warranty Status (Mimicking the two original states: check/WarrentyChech and message/Warrenty)
    const [warrantyStatus, setWarrantyStatus] = useState({
        check: false, // Corresponds to WarrentyChech
        message: "Awaiting Engine Number...", // Corresponds to Warrenty
    });

    // State for Complaint Registration Form Data (Corresponds to original 'data' state)
    const [complaintData, setComplaintData] = useState(initialComplaintData);
    const [isRegistering, setIsRegistering] = useState(false);

    // State for Pop-up Notifications
    const [popup, setPopUp] = useState(false);
    const [notification, setNotification] = useState({
        message: "",
        type: "", // 'success' or 'error'
        title: "",
    });

    // Unified handler for complaint form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setComplaintData(prev => ({ ...prev, [name]: value }));
    };

    // --- State Handler for Original fetchData Signature ---
    // This is necessary to adapt the helper function's output to the new component states
    // --- State Handler for Original fetchData Signature ---
    const handleSetData = (apiData) => {
        // --- 1. Map Complaint Form Data ---
        setComplaintData(prev => ({
            ...prev,
            chassisNo: apiData.chassisNo || "",
            customerName: apiData.customerName || "",
            dealerName: apiData.dealerName || "",
            Location: apiData.Location || "",
            state: apiData.state || "",
            Hours: apiData.Hours || "",
            contact: apiData.contact || "",
        }));

        // --- 2. Determine Warranty Status based on Date of Sale (doS) ---
        const dateOfSale = apiData.doS; // Assuming this is a valid date string (e.g., "YYYY-MM-DD")
        let isUnderWarranty = false;
        let warrantyMessage = "Warranty status unavailable.";

        if (dateOfSale) {
            const dosDate = new Date(dateOfSale);
            const expiryDate = new Date(dosDate);

            // Add 1 year (12 months) to the Date of Sale
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);

            const currentDate = new Date();

            if (currentDate <= expiryDate) {
                isUnderWarranty = true;
                // Format expiry date nicely for the message
                const formattedExpiry = expiryDate.toLocaleDateString();
                warrantyMessage = `Under Warranty. Expires on: ${formattedExpiry}`;
            } else {
                isUnderWarranty = false;
                warrantyMessage = "Warranty Expired (Over 1 Year from Sale Date).";
            }
        } else {
            // Handle case where doS might be missing in API response
            warrantyMessage = "Date of Sale (doS) missing from data.";
        }

        // --- 3. Update Warranty Status State ---
        setWarrantyStatus({
            check: isUnderWarranty,
            message: warrantyMessage,
        });
    }


    // Handler for fetching engine data
    const handleFetch = async () => {
        if (engineNo.trim() === "") {
            setNotification({
                message: "Please enter a valid Engine Number.",
                type: "error",
                title: "Input Error"
            });
            setPopUp(true);
            return;
        }

        setIsFetching(true);
        // Clear previous complaint data upon new fetch attempt, except engineNo
        setComplaintData(initialComplaintData);

        try {
            // CALLING ORIGINAL HELPER FUNCTION SIGNATURE:
            // fetchData(engineNo, chassisNo, setData, setNotification, setPopUp)
            await fetchData(
                engineNo,
                complaintData.chassisNo, // Using current chassisNo (likely empty) as per original signature
                handleSetData,         // Custom handler to map output to new states
                setNotification,
                setPopUp
            );

        } catch (error) {
            setNotification({
                message: "Failed to fetch data. Please check the Engine Number and try again.",
                type: "error",
                title: "Fetch Error",
            });
            setPopUp(true);
        } finally {
            setIsFetching(false);
        }
    };

    // Function to handle complaint registration submission (Simulated)
    const handleRegister = async (e) => {
        e.preventDefault();

        // Basic validation: ensure key fields are filled
        if (!engineNo || !complaintData.chassisNo || !complaintData.customerName || !complaintData.Problem) {
            setNotification({
                message: "Please fetch engine data and fill in all required fields, including the Problem description.",
                type: "error",
                title: "Validation Error",
            });
            setPopUp(true);
            return;
        }

        setIsRegistering(true);

        try {
            const result = await regComplaint(engineNo, complaintData);
            if (result) {
                setNotification({
                    message: `Complaint for Engine No. ${engineNo} registered successfully!`,
                    type: "success",
                    title: "Success 🎉",
                });
                setPopUp(true);

                // Clear form after successful registration
                setEngineNo("");
                setComplaintData(initialComplaintData);
                setWarrantyStatus({
                    check: true,
                    message: "Awaiting Engine Number...",
                });

            }
            else{                setNotification({
                    message: `ERROr`,
                    type: "",
                    title: "ERROR",
                });
                setPopUp(true);}
        } catch (error) {
            // Error handling for registration failure
            setNotification({
                message: error.message || "An error occurred while registering the complaint.",
                type: "error",
                title: "Registration Failed 🛑",
            });
            setPopUp(true);
        } finally {
            setIsRegistering(false);
        }
    };

    // Helper to determine if the complaint form fields should be active 
    const isFormActive = !!complaintData.customerName;


    return (
        <>
            {/* PopUp Component */}
            {popup && (
                <PopUp
                    data={notification.message}
                    type={notification.type}
                    onClose={() => setPopUp(false)}
                    isOpen={true}
                    title={notification.title}
                />
            )}

            <div className="w-full p-6 bg-gray-100 h-fit">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-blue-500 pb-3">
                        Complaint Registration ⚙️
                    </h1>

                    <div className="bg-white p-8 rounded-xl shadow-2xl space-y-10">

                        {/* ------------------------------------- */}
                        {/* 1. Fetch Engine Data Section          */}
                        {/* ------------------------------------- */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Fetch Engine Data</h2>
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <input
                                    type="text"
                                    value={engineNo}
                                    placeholder="Enter Engine No."
                                    onChange={(e) => setEngineNo(e.target.value)}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 text-lg transition duration-150"
                                    required
                                    aria-label="Engine Number Input"
                                />
                                <button
                                    type="button"
                                    onClick={handleFetch}
                                    disabled={isFetching || engineNo.trim() === ""}
                                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 shadow-md"
                                >
                                    {isFetching ? "Fetching..." : "Fetch Data"}
                                </button>
                            </div>

                            {/* Display Warranty Status with enhanced UI */}
                            {warrantyStatus.check ?
                                <div className="mt-6 text-center border p-4 rounded-lg bg-yellow-50">
                                    <h3 className="text-md font-medium text-gray-700 mb-2">Current Warranty Status:</h3>
                                    <div className={`text-xl font-extrabold p-2 rounded-md ${warrantyStatus.check ? "text-green-700 bg-green-100 border-green-300" : "text-red-700 bg-red-100 border-red-300"}`}>
                                        {warrantyStatus.message}
                                    </div>
                                </div> : ""}
                        </section>

                        <hr className="border-t-2 border-gray-200" />

                        {/* ------------------------------------- */}
                        {/* 2. Complaint Registration Section     */}
                        {/* ------------------------------------- */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-6">2. Register Complaint Details</h2>
                            <form onSubmit={handleRegister} className="space-y-6">

                                {/* Fetched Data Fields (Read-Only) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl border border-blue-200 bg-blue-50">
                                    <h3 className="sm:col-span-2 text-lg font-bold text-blue-800">Engine & Customer Information (Fetched)</h3>

                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Chassis No.</label>
                                        <input
                                            type="text"
                                            name="chassisNo"
                                            value={complaintData.chassisNo}
                                            placeholder="Chassis No. (Fetched)"
                                            className="px-4 py-2 border border-blue-300 rounded-md bg-white text-gray-700 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Customer Name</label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={complaintData.customerName}
                                            placeholder="Customer Name (Fetched)"
                                            className="px-4 py-2 border border-blue-300 rounded-md bg-white text-gray-700 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Complaint Input Fields */}
                                <h3 className="text-lg font-bold text-gray-700 pt-4">Complaint Metadata</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Dealer Name</label>
                                        <input
                                            type="text"
                                            name="dealerName"
                                            value={complaintData.dealerName}
                                            placeholder="Dealer Name"
                                            onChange={handleChange}
                                            className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isFormActive ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            required
                                            disabled={!isFormActive}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Contact</label>
                                        <input
                                            type="number"
                                            name="contact"
                                            value={complaintData.contact}
                                            placeholder="Contact: +91 00000 00000"
                                            onChange={handleChange}
                                            className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isFormActive ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            required
                                            disabled={!isFormActive}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Location</label>
                                        <input
                                            type="text"
                                            name="Location"
                                            value={complaintData.Location}
                                            placeholder="Location"
                                            onChange={handleChange}
                                            className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isFormActive ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            required
                                            disabled={!isFormActive}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={complaintData.state}
                                            placeholder="State"
                                            onChange={handleChange}
                                            className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isFormActive ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            required
                                            disabled={!isFormActive}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Working Hours</label>
                                        <input
                                            type="number"
                                            name="Hours"
                                            value={complaintData.Hours}
                                            placeholder="Working Hours"
                                            onChange={handleChange}
                                            className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isFormActive ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            required
                                            disabled={!isFormActive}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Problem Description</label>
                                    <textarea
                                        name="Problem"
                                        value={complaintData.Problem}
                                        placeholder="Describe the Problem in Detail"
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isFormActive ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        rows="5"
                                        required
                                        disabled={!isFormActive}
                                    />
                                </div>

                                <div className="flex justify-center pt-4">
                                    <button
                                        type="submit"
                                        disabled={isRegistering || !isFormActive}
                                        className="px-12 py-4 bg-green-600 text-white text-xl font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 shadow-lg hover:shadow-xl"
                                    >
                                        {isRegistering ? "Registering..." : "Register Complaint"}
                                    </button>
                                </div>
                            </form>
                        </section>

                    </div>
                </div>
            </div>
        </>
    );
}