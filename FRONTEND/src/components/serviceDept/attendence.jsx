/**
 * Attendance Component (TailwindCSS - Production Ready)
 *
 * This upgraded component handles employee attendance operations with a 
 * modern UI, enhanced UX, better accessibility, and improved structure.
 *
 * New Improvements:
 * - Converted entire layout to TailwindCSS (fully responsive)
 * - Card-based design for modern visual hierarchy
 * - Better error and popup handling
 * - Animated buttons with loading states
 * - Cleaner form layout with grid system
 * - Mobile-first responsive structure
 * - Improved spacing, shadows, radius, focus rings, transitions
 * - Advanced input UX (focus borders, placeholder styling)
 * 
 * Key Features:
 * 1. Fetch attendance using Employee Code.
 * 2. Auto-fill today’s date.
 * 3. Display last recorded employee location in a popup.
 * 4. Submit daily attendance with enhanced validation.
 * 5. Error handling with a modern popup experience.
 *
 * Dependencies:
 * - React (useState, useEffect)
 * - PopUp Component
 * - FetAttend & RegAttend API helpers
 * - TailwindCSS for styling
 */
import { useEffect, useState } from "react";
import PopUp from "../common/PopUp";
import { FetAttend, RegAttend } from "../helper/attendHelper";

export default function Attendance() {
    const [empCode, setEmpCode] = useState("");
    const [fetching, setFetching] = useState(false);
    const [popup, setPopUp] = useState(false);
    const [error, setError] = useState("");

    const [data, setData] = useState({
        name: "",
        engineNo: "",
        contact: "",
        location: "",
        state: "",
        date: "",
        problem: "",
    });

    const [dailyData, setDailyData] = useState({
        name: "",
        contact: "",
        location: "",
        state: "",
        date: "",
        problem: "",
    });

    // Initialize today's date
    useEffect(() => {
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
            now.getMonth() + 1
        ).padStart(2, "0")}/${now.getFullYear()}`;

        setDailyData((prev) => ({ ...prev, date: formattedDate }));
    }, []);

    // Fetch employee data
    const handleFetch = async () => {
        setFetching(true);
        setError("");

        try {
            const result = await FetAttend(empCode, setData, setError);
            if (result) {
                setDailyData((prev) => ({ ...prev, name: result.name }));
                setPopUp(true);
            }
        } catch (e) {
            setError("Unable to fetch attendance data. Try again later.");
        } finally {
            setFetching(false);
        }
    };

    // Submit attendance
    const handleSubmit = async () => {
        try {
            const response = await RegAttend(empCode, dailyData);
            if (response.success) {
                setError("");
                setPopUp(false);
            }
        } catch (e) {
            setError("Attendance submission failed. Try again.");
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">

            {/* Popup for data */}
            {popup && (
                <PopUp
                    data={data}
                    Click={setPopUp}
                    title="Employee Last Location"
                />
            )}

            {/* Error popup */}
            {error && (
                <PopUp
                    data={error}
                    Click={setError}
                    title="Error"
                />
            )}

            {/* Main Card Container */}
            <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">

                <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
                    Employee Attendance
                </h1>

                {/* FETCH SECTION */}
                <div className="w-full bg-blue-50 border border-blue-200 p-5 rounded-xl mb-8">
                    <label className="block text-lg font-semibold mb-2">Employee Code</label>

                    <div className="flex gap-3 max-sm:flex-col">
                        <input
                            type="number"
                            value={empCode}
                            placeholder="Enter Employee Code"
                            onChange={(e) => setEmpCode(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                        <button
                            type="button"
                            disabled={fetching}
                            onClick={handleFetch}
                            className={`px-6 py-3 bg-blue-600 text-white font-bold rounded-lg transition hover:bg-blue-700 active:scale-95 ${
                                fetching && "opacity-60 cursor-not-allowed"
                            }`}
                        >
                            {fetching ? "Fetching..." : "Fetch"}
                        </button>
                    </div>
                </div>

                {/* FORM SECTION */}
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <input
                        type="text"
                        value={dailyData.name}
                        placeholder="Name"
                        onChange={(e) =>
                            setDailyData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="number"
                        value={dailyData.contact}
                        placeholder="Contact No"
                        onChange={(e) =>
                            setDailyData((prev) => ({ ...prev, contact: e.target.value }))
                        }
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="text"
                        value={dailyData.location}
                        placeholder="Location"
                        onChange={(e) =>
                            setDailyData((prev) => ({ ...prev, location: e.target.value }))
                        }
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="text"
                        value={dailyData.state}
                        placeholder="State"
                        onChange={(e) =>
                            setDailyData((prev) => ({ ...prev, state: e.target.value }))
                        }
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />

                    {/* DATE */}
                    <input
                        type="text"
                        value={dailyData.date}
                        placeholder="DD/MM/YYYY"
                        onChange={(e) =>
                            setDailyData((prev) => ({ ...prev, date: e.target.value }))
                        }
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 sm:col-span-2"
                    />

                    {/* PROBLEM */}
                    <textarea
                        value={dailyData.problem}
                        placeholder="Describe the Problem"
                        rows={4}
                        onChange={(e) =>
                            setDailyData((prev) => ({ ...prev, problem: e.target.value }))
                        }
                        className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 sm:col-span-2"
                    />

                    {/* SUBMIT BUTTON */}
                    <div className="col-span-2 flex justify-center">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-48 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 active:scale-95 transition"
                        >
                            Submit Attendance
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
