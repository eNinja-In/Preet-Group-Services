import { useState } from "react";
import PopUp from "../../common/PopUp";

// --- SVG Icons ---
const PlusIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const UserCheckIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M16 4v2m-4-2v2m-4-2v2M4 12H2m10 8h2m-4-8H4m16 0h2m-4 8v2m-4-2v2m-4-2v2" />
        <circle cx="12" cy="7" r="4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12a3 3 0 106 0 3 3 0 00-6 0z" />
    </svg>
);

// --- Component Logic ---
const initialDispatchData = {
    dispatchDate: "",
    empCode: "",
    empName: "", // New field for employee name
    contact: "",
    materials: [{ name: "", quantity: 0, price: 0, total: 0 }],
};

export default function AddDispatch() {
    const [dispatchData, setDispatchData] = useState(initialDispatchData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingEmp, setIsFetchingEmp] = useState(false);
    const [popup, setPopUp] = useState(false);
    const [notification, setNotification] = useState({ message: "", type: "", title: "" });

    // Function to calculate the grand total for all materials
    const grandTotal = dispatchData.materials.reduce((sum, material) => sum + material.total, 0);

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "empCode") { setDispatchData(prev => ({ ...prev, [name]: value, empName: "", contact: "" })); }
        else { setDispatchData(prev => ({ ...prev, [name]: value })); }
    };

    const handleMaterialChange = (index, e) => {
        const { name, value } = e.target;
        const numericValue = ["quantity", "price"].includes(name) ? parseFloat(value) || 0 : value;

        setDispatchData((prevState) => {
            const updatedMaterials = [...prevState.materials];
            updatedMaterials[index] = { ...updatedMaterials[index], [name]: numericValue };

            const quantity = parseFloat(updatedMaterials[index].quantity) || 0;
            const price = parseFloat(updatedMaterials[index].price) || 0;
            updatedMaterials[index].total = quantity * price;

            return { ...prevState, materials: updatedMaterials };
        });
    };

    const addMaterial = () => {
        setDispatchData((prevState) => ({ ...prevState, materials: [...prevState.materials, { name: "", quantity: 0, price: 0, total: 0 }], }));
    };

    const removeMaterial = (index) => {
        const updatedMaterials = dispatchData.materials.filter((_, i) => i !== index);
        setDispatchData((prevState) => ({ ...prevState, materials: updatedMaterials, }));
    };

    const fetchEmployeeData = () => {
        if (!dispatchData.empCode) {
            setNotification({ message: "Please enter an Employee Code before fetching data.", type: "warning", title: "Missing Input", });
            setPopUp(true);
            return;
        }

        setIsFetchingEmp(true);

        new Promise((resolve) => {
            setTimeout(() => {
                const code = dispatchData.empCode.toUpperCase();
                if (code === "E1001") { resolve({ success: true, name: "Alice Johnson", contact: "9876543210" }); }
                else if (code === "E1002") { resolve({ success: true, name: "Bob Williams", contact: "9912345678" }); }
                else if (code === "E9999") { resolve({ success: false, message: "Employee not found." }); }
                else { resolve({ success: true, name: "New Employee", contact: "1234567890" }); }
            }, 1500); // 1.5 second delay
        })
            .then((response) => {
                if (response.success) {
                    setDispatchData(prev => ({ ...prev, empName: response.name, contact: response.contact }));
                    setNotification({ message: `Data fetched successfully for ${response.name} (${dispatchData.empCode}).`, type: "success", title: "Employee Found ✅", });
                } else {
                    setNotification({ message: response.message || "Could not retrieve employee data. Please verify the code.", type: "error", title: "Fetch Failed ❌", });
                    setDispatchData(prev => ({ ...prev, empName: "", contact: "" })); // Clear on failure
                }
                setPopUp(true);
            })
            .finally(() => { setIsFetchingEmp(false); });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const materialsValid = dispatchData.materials.every((m) => m.name && parseFloat(m.quantity) > 0 && parseFloat(m.price) >= 0);

        if (!dispatchData.dispatchDate || !dispatchData.empCode || !dispatchData.empName || !dispatchData.contact || dispatchData.materials.length === 0 || !materialsValid) {
            setNotification({
                message: "Please ensure all mandatory details (Date, Employee Code, Name, Contact) are complete, and materials have a name, quantity (> 0), and price.",
                type: "error",
                title: "Validation Error",
            });
            setPopUp(true);
            return;
        }

        setIsSubmitting(true);

        // Simulate a form submission API call
        setTimeout(() => {
            setNotification({
                message: `Dispatch registered successfully for ${dispatchData.empName}. Grand Total: $${grandTotal.toFixed(2)}.`,
                type: "success",
                title: "Success 🎉",
            });
            setPopUp(true);
            setIsSubmitting(false);
            setDispatchData(initialDispatchData); // Reset form
        }, 2000);
    };

    const handlePrint = () => { window.print(); };

    return (
        <>
            {popup && (
                <PopUp
                    data={notification.message}
                    type={notification.type}
                    onClose={() => setPopUp(false)}
                    isOpen={true}
                    title={notification.title}
                />
            )}

            <div className="w-full p-6 sm:p-8 bg-gray-100 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold text-blue-700">
                            Material Dispatch Record <span className="text-gray-500">#New</span>
                        </h1>
                        {/* <p className="text-gray-500 mt-1">Efficiently log materials distributed to personnel.</p> */}
                    </header>

                    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-200">
                        <form onSubmit={handleSubmit} className="space-y-10">

                            {/* General Dispatch Information */}
                            <section>
                                <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">
                                    Recipient & Date Details 👥
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                                    {/* 1. Dispatch Date */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Dispatch Date</label>
                                        <input
                                            type="date"
                                            name="dispatchDate"
                                            value={dispatchData.dispatchDate}
                                            onChange={handleChange}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                                            required
                                        />
                                    </div>

                                    {/* 2. Employee Code (with Fetch Button) */}
                                    <div className="flex flex-col col-span-1">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Employee Code</label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                name="empCode"
                                                value={dispatchData.empCode}
                                                onChange={handleChange}
                                                placeholder="E.g., E1001"
                                                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 uppercase"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={fetchEmployeeData}
                                                disabled={isFetchingEmp || !dispatchData.empCode}
                                                title="Fetch Employee Data"
                                                className="p-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 flex items-center justify-center"
                                            >
                                                {isFetchingEmp ? (
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <UserCheckIcon className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* 3. Employee Name (Fetched/Read-only style) */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Employee Name</label>
                                        <input
                                            type="text"
                                            name="empName"
                                            value={dispatchData.empName}
                                            readOnly
                                            placeholder="Fetched automatically"
                                            className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-default"
                                        />
                                    </div>

                                    {/* 4. Contact Number (Fetched) */}
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Contact Number</label>
                                        <input
                                            type="tel"
                                            name="contact"
                                            value={dispatchData.contact}
                                            readOnly
                                            placeholder="Fetched automatically"
                                            className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-default"
                                        />
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-200" />

                            {/* Dynamic Material List Table Section */}
                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-700">Material List 📦</h2>
                                    <button
                                        type="button"
                                        onClick={addMaterial}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-150 flex items-center space-x-1"
                                        title="Add New Material"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        <span>Add Item</span>
                                    </button>
                                </div>

                                <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Material Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price/Unit ($)</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total ($)</th>
                                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {dispatchData.materials.map((material, index) => (
                                                <tr key={index} className="hover:bg-blue-50/50 transition duration-100">
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                                    <td className="px-6 py-3 whitespace-nowrap">
                                                        <input type="text" name="name" value={material.name} onChange={(e) => handleMaterialChange(index, e)} placeholder="Material name" className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" required />
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap">
                                                        <input type="number" name="quantity" value={material.quantity} onChange={(e) => handleMaterialChange(index, e)} min="0.01" step="0.01" className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" required />
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap">
                                                        <input type="number" name="price" value={material.price} onChange={(e) => handleMaterialChange(index, e)} min="0" step="0.01" className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" required />
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 font-bold">${material.total.toFixed(2)}</td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-center">
                                                        <button type="button" onClick={() => removeMaterial(index)} className="p-1.5 text-red-600 rounded-full hover:bg-red-100 transition duration-150 disabled:opacity-50" disabled={dispatchData.materials.length === 1} title="Remove Material">
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* Total Row */}
                                            <tr className="bg-blue-50/50">
                                                <td colSpan="4" className="px-6 py-4 text-right text-lg font-bold text-gray-800">Grand Total:</td>
                                                <td className="px-6 py-4 text-xl font-extrabold text-blue-700">${grandTotal.toFixed(2)}</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Action Buttons */}
                            <div className="flex justify-end pt-8 gap-4">
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="px-8 py-3 bg-gray-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-gray-600 transition duration-150"
                                >
                                    Print / PDF 🖨️
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 flex items-center justify-center"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Dispatch"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}