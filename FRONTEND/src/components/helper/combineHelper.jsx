export const registerCombine = async (data) => {
    const { combineModel, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state } = data;

    if (![combineModel, engineNo, doS, fipNo].every(Boolean)) {
        return { success: false, message: "Model, Engine No, Date of Sale, and State are required." };
    }
    console.log(data)
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_LINK}/api/combine/register-combine`, {
            method: "POST",
            body: JSON.stringify({ model : combineModel, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state }),
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
