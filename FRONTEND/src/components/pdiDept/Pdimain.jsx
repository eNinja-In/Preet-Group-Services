import { useState } from "react";
import PopUp from "../common/PopUp";
import { registerCombine } from "../helper/combineHelper"; // Import the helper function

export default function CombineDataRegistration() {
    const [formData, setFormData] = useState({
        model: "",
        engineNo: "",
        chassisNo: "",
        fipNo: "",
        doS: "",
        customerName: "",
        dealerName: "",
        state: "",
    });

    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [popup, setPopUp] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => { return { ...prev, [name]: value }; });
    };


    // Modify formData to replace empty fields with "NaN" before submission
    const sanitizeFormData = (data) => {
        const sanitizedData = { ...data };
        Object.keys(sanitizedData).forEach((key) => {
            if (sanitizedData[key] === "" || sanitizedData[key] === null || sanitizedData[key] === undefined) { sanitizedData[key] = "NaN"; }
        });
        return sanitizedData;
    };

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const sanitizedData = sanitizeFormData(formData); // Sanitize form data before sending

            const response = await registerCombine(sanitizedData); // Pass sanitized data to the backend function

            if (response.success) {
                setNotification({
                    message: response.data,
                    type: response.message,
                });
                // Reset the form after successful submission
                setFormData({
                    model: "", engineNo: "", chassisNo: "", fipNo: "", doS: "", customerName: "", dealerName: "", state: "",
                });
            } else {
                setNotification({
                    message: response.message || "!! AN ERROR OCCURED !!",
                    type: "ERROR",
                });
            }
        } catch (error) {
            setNotification({ message: error.message || "!! An error occurred while registering the data !!", type: "ERROR" });
        } finally {
            setLoading(false);
            setPopUp(true);
        }
    };

    return (
        <div className="w-full p-6 bg-white">
            {popup && (
                <PopUp
                    data={notification.message}
                    type={notification.type}
                    onClose={() => setPopUp(false)}
                    isOpen={true}
                    title={notification.type}
                />
            )}

            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Dynamically render form fields */}
                        {["model", "engineNo", "chassisNo", "fipNo", "doS", "customerName", "dealerName", "state"].map((field, index) => (
                            <div key={index} className="flex flex-wrap gap-6">
                                <div className="flex-1">
                                    <input
                                        type={field === "doS" ? "date" : "text"}
                                        name={field}
                                        value={formData[field]}
                                        placeholder={field.replace(/([A-Z])/g, ' $1').toUpperCase()}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required={field == "engineNo" && field == "fipNo"} // EngineNo & FIPNo are optional
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-center">
                            <button
                                // type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
