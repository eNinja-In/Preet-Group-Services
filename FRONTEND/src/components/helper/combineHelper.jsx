export const registerCombine = async (data) => {
    const { combineModel, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state } = data;

    if (![combineModel, engineNo, doS, fipNo].every(Boolean)) { return { success: false, message: "Model, Engine No, Date of Sale, and State are required." }; }

    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_LINK}/api/combine/register-combine`, {
            method: "POST",
            body: JSON.stringify({ model: combineModel, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state }),
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (response.ok && result.success) { return result; }
        else { return { success: false, message: result.message || "Registration failed." }; }

    } catch (error) {
        console.error("Error while registering combine:", error);
        return { success: false, message: "Server error occurred while registering combine data." };
    }
};



export const updateCombine = async (data) => {
    const { combineModel, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state } = data;

    if (![combineModel, engineNo, chassisNo].every(Boolean)) return { success: false, message: "Model, Engine No, and Chassis No are required." };

    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_LINK}/api/combine/update-combine`, {
            method: "PUT",
            body: JSON.stringify({ model: combineModel, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state }),
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (response.ok && result.success) return result;
        else return { success: false, message: result.message || "Update failed." };
    } catch (error) {
        // console.error("Error while updating combine:", error);
        return { success: false, message: "Server error occurred while updating combine data." };
    }
};




export const getCombineDataByDate = async (startDate, endDate) => {

    if (![startDate, endDate].every(Boolean)) { return { success: false, message: "Start Date and End Date are required." }; }
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_LINK}/api/combine/get-combine-by-date`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ startDate, endDate }),
        });

        const result = await response.json();

        if (response.ok && result.success) { return result; }
        else { return { success: false, message: result.message || "Failed to fetch combine data." }; }
    } catch (error) {
        console.error("Error while fetching combine data:", error);
        return { success: false, message: "Server error occurred while fetching combine data." };
    }
};


export const getCombineData = async (engineNo, chassisNo) => {
    // 1. Basic validation check matching the backend logic
    if (!engineNo && !chassisNo) return { success: false, message: "Either Engine Number or Chassis Number is required." };

    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_LINK}/api/combine/get-combine`, {
            method: 'POST', // The backend uses req.body, suggesting a POST request
            body: JSON.stringify({ engineNo, chassisNo, }),
            headers: { 'Content-Type': 'application/json', },
        });

        const result = await response.json();

        if (!response.success) {
            console.error(`Fetch failed with status ${response.status}:`, result.message);
            return { success: false, message: result.message || `An error occurred with status ${response.status}.`, };
        }

        return { success: true, message: result.message, data: result.data, };

    } catch (error) {
        return { success: false, message: "A network error occurred. Check your connection or server status.", };
    }
};