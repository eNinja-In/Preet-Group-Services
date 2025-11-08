import style from "./CSS/custromerComp.module.css";
import PopUp from '../common/PopUp';
import { useEffect, useState } from "react";
import { FetAttend, RegAttend } from "../helper/attendHelper";

export default function Attendence() {
    const [empCode, setEmpCode] = useState("");
    const [fetching, setFetching] = useState(false);
    const [popup, setPopUp] = useState(false);
    const [error, setError] = useState(""); // Error state for API errors

    // State for storing fetched data
    const [data, setData] = useState({
        name: "",
        engineNo: "",
        contact: "",
        location: "",
        state: "",
        date: "",
        problem: ""
    });

    // Daily data state, initially same as 'data', but updates independently
    const [dailyData, setDailyData] = useState({
        // name: "",
        engineNo: "",
        contact: "",
        location: "",
        state: "",
        date: ""
    });

    // Effect for initializing today's date in `dailyData`
    useEffect(() => {
        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

        setDailyData(prev => ({ ...prev, date: formattedDate }));
        setDailyData(prev => ({ ...prev, name: data.name }));

    }, []);

    // Fetch the employee attendance info
    const handleFetch = async () => {
        setFetching(true); // Show fetching state
        setError(""); // Reset error state on new fetch

        try {
            const result = await FetAttend(empCode, setData, setError); // Fetch data using helper function
            if (result) setPopUp(true);
        } catch (error) {
            console.error("Error during data fetch:", error);
            setError("Failed to fetch attendance data. Please try again.");
        } finally {
            setFetching(false); // Reset fetching state
        }


    };
    // Handle form submit (register attendance or similar)
    const handleSubmit = async () => {
        // console.log("Submitting...");

        // Assuming RegAttend needs all data from `dailyData` and `data`
        // const submitData = {
        //     ...dailyData,
        //     name: data.name,
        // };

        try {
            const response = await RegAttend(empCode, dailyData); // Call helper function for attendance registration
            if (response.success) {
                setPopUp(false); // Close the popup if successful
                setError(""); // Clear error on success
            }
        } catch (error) {
            // console.error("Error during attendance registration:", error);
            setError("Error while registering attendance. Please try again.");
        }
    };

    return (
        <div className={style.main}>
            {popup && <PopUp data={data} Click={setPopUp} title={"Employee Last Location"} />}

            {/* Display error message */}
            {error && <PopUp data={error} Click={setError} title={"ERROR"} />}

            <div className={style.attend} style={{ width: '100%' }}>
                <div className={style.form}>
                    <form className={style.fetchForm}>
                        <div className={style.autoInfoInput}>
                            <div className={style.inputSection}>
                                <input
                                    type="number"
                                    value={empCode}
                                    placeholder="Employee Code"
                                    onChange={(e) => setEmpCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={style.fetchData}>
                                <button
                                    className={style.fetchBtn}
                                    type="button"
                                    disabled={fetching}
                                    onClick={handleFetch}
                                >
                                    {fetching ? "FETCHING..." : "FETCH"}
                                </button>
                            </div>
                        </div>
                    </form>

                    <form className={style.dataForm}>
                        <div className={style.complaintForm}>
                            {/* Name Input */}
                            <div className={style.inputSection}>
                                <input
                                    type="text"
                                    value={data.name || dailyData.name} // Prioritize fetched data
                                    placeholder="Name"
                                    onChange={(e) => setDailyData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>

                            {/* Contact No */}
                            <div className={style.inputSection} style={{ marginRight: '10%' }}>
                                <input
                                    type="number"
                                    value={dailyData.contact}
                                    placeholder="Contact No"
                                    onChange={(e) => setDailyData(prev => ({ ...prev, contact: e.target.value }))}
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div className={style.inputSection}>
                                <input
                                    type="text"
                                    value={dailyData.location}
                                    placeholder="Location"
                                    onChange={(e) => setDailyData(prev => ({ ...prev, location: e.target.value }))}
                                    required
                                />
                            </div>

                            {/* State */}
                            <div className={style.inputSection}>
                                <input
                                    type="text"
                                    value={dailyData.state}
                                    placeholder="State"
                                    onChange={(e) => setDailyData(prev => ({ ...prev, state: e.target.value }))}
                                    required
                                />
                            </div>

                            {/* Date */}
                            <div className={style.inputSection}>
                                <input
                                    type="text"
                                    value={dailyData.date}
                                    onChange={(e) => setDailyData(prev => ({ ...prev, date: e.target.value }))}
                                    placeholder="DATE : DD/MM/YYYY"
                                />
                            </div>
                            {/* Problem */}
                            <div className={style.inputSection} style={{ marginRight: '20%', height: 'auto' }}>
                                <textarea
                                    type="text"
                                    value={dailyData.problem}
                                    onChange={(e) => setDailyData(prev => ({ ...prev, problem: e.target.value }))}
                                    placeholder="Problem"
                                    style={{ width: '195%' }}
                                    cols={'10'}
                                    rows={'6'}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className={style.regData}>
                                <button className={style.regBtn} type="button" onClick={handleSubmit}>
                                    SUBMIT
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
