import { useState, useEffect, useCallback } from "react";
import PopUp from "../../common/PopUp";
import { FetAttend, RegAttend } from "../../helper/attendHelper";

// Default state for form data
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
    const [error, setError] = useState(null);

    const [lastFetchedData, setLastFetchedData] = useState(initialDataState);
    const [dailyFormData, setDailyFormData] = useState(initialDataState);

    // Initializes today's date in DD/MM/YYYY format
    useEffect(() => {
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
        setDailyFormData(prev => ({ ...prev, date: formattedDate }));
    }, []);

    // Form field change handler
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setDailyFormData(prev => ({ ...prev, [name]: value }));
    };

    // Fetch employee data
    const handleFetch = useCallback(async () => {
        if (!empCode.trim()) {
            setError("Please enter a valid Employee Code.");
            return;
        }

        setFetching(true);
        try {
            const fetchedData = await FetAttend(empCode.trim());
            setLastFetchedData(fetchedData);

            setDailyFormData(prev => ({
                ...prev,
                name: fetchedData.name,
                contact: fetchedData.contact,
            }));

            setShowLastLocationPopup(true);

        } catch (e) {
            setError(`Fetch Error: ${e.message || 'Unable to fetch data.'}`);
        } finally {
            setFetching(false);
        }
    }, [empCode]);

    // Submit the attendance form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!dailyFormData.name || !dailyFormData.location || !dailyFormData.date) {
            setError("Name, Location, and Date are required fields.");
            return;
        }

        setSubmitting(true);
        try {
            const result = await RegAttend(empCode.trim(), dailyFormData);
            setDailyFormData(initialDataState);
            setError(`✅ ${result.message}`);
        } catch (e) {
            setError(`Submission Error: ${e.message || 'Failed to submit attendance.'}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
            {/* Popups for error and success */}
            {showLastLocationPopup && <PopUp data={lastFetchedData} Click={setShowLastLocationPopup} title="Employee Last Location" />}
            {error && <PopUp data={error} Click={setError} title={error.startsWith("✅") ? "Success" : "Error"} isError={!error.startsWith("✅")} />}

            {/* Main form */}
            <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-8">
                <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8">🛠️ Employee Daily Attendance</h1>
                <div className="w-full bg-blue-50 border border-blue-200 p-5 rounded-xl mb-8">
                    <label htmlFor="empCode" className="block text-lg font-semibold mb-2 text-gray-700">Employee Code</label>
                    <div className="flex gap-3 max-sm:flex-col">
                        <input
                            id="empCode"
                            type="text"
                            value={empCode.toUpperCase()}
                            placeholder="Enter Employee Code"
                            onChange={(e) => setEmpCode(e.target.value)}
                            disabled={fetching || submitting}
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition duration-150"
                        />
                        <button
                            type="button"
                            onClick={handleFetch}
                            disabled={fetching || submitting || !empCode.trim()}
                            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg transition duration-150 ease-in-out hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {fetching ? "Fetching..." : "Fetch Employee Data"}
                        </button>
                    </div>
                </div>

                {/* Form section for daily attendance */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Various input fields */}
                    <input type="text" name="name" value={dailyFormData.name} placeholder="Employee Name" onChange={handleFormChange} required className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-150" />
                    <input type="text" name="engineNo" value={dailyFormData.engineNo} placeholder="Engine No" onChange={handleFormChange} className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 cursor-not-allowed" />
                    <input type="tel" name="contact" value={dailyFormData.contact} placeholder="Contact No" onChange={handleFormChange} className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-150" />
                    <input type="text" name="location" value={dailyFormData.location} placeholder="Current Location" onChange={handleFormChange} required className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-150" />
                    <input type="text" name="state" value={dailyFormData.state} placeholder="Current State" onChange={handleFormChange} className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-150" />
                    <input type="text" name="date" value={dailyFormData.date} placeholder="DD/MM/YYYY" onChange={handleFormChange} className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 cursor-not-allowed" />
                    <textarea name="problem" value={dailyFormData.problem} placeholder="Describe the Problem / Task" onChange={handleFormChange} className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 sm:col-span-2 transition duration-150" />
                    
                    <div className="col-span-2 flex justify-center mt-4">
                        <button
                            type="submit"
                            disabled={submitting || fetching}
                            className={`w-48 py-3 bg-green-600 text-white font-bold rounded-lg transition duration-150 ease-in-out hover:bg-green-700 active:scale-[0.98] ${(submitting || fetching) && "opacity-60 cursor-not-allowed"}`}
                        >
                            {submitting ? "Submitting..." : "Submit Attendance"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
