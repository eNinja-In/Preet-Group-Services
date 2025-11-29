import React, { useReducer, useCallback } from "react";
import PopUp from "../common/PopUp";
import { registerCombine } from "../helper/combineHelper";
import PrintDetails from "../Print/PdiSheetPrint";

// --- STATE MANAGEMENT (useReducer) ---

const initialState = {
    // Form Data
    combineModel: "",
    engineNo: "",
    trem: "4", // Default value for TREM
    chassisNo: "",
    fipNo: "",
    remarks: "",
    checkpoints: {},
    doS: "",
    customerName: "", // Updated to empty string for cleaner validation/display
    dealerName: "",
    state: "",

    // UI State
    loading: false,
    popupOpen: false,
    note: { message: "", type: "" },
    errors: {}, // Validation errors
};

const actionTypes = {
    HANDLE_INPUT: 'HANDLE_INPUT',
    HANDLE_CHECK: 'HANDLE_CHECK',
    SET_UI_STATE: 'SET_UI_STATE',
    SET_LOADING: 'SET_LOADING',
    SET_ERRORS: 'SET_ERRORS',
    RESET_FORM: 'RESET_FORM',
};

function formReducer(state, action) {
    switch (action.type) {
        case actionTypes.HANDLE_INPUT:
            return { ...state, [action.field]: action.value };
        case actionTypes.HANDLE_CHECK:
            return {
                ...state,
                checkpoints: { ...state.checkpoints, [action.point]: action.value },
            };
        case actionTypes.SET_UI_STATE:
            return { ...state, ...action.payload };
        case actionTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        case actionTypes.SET_ERRORS:
            return { ...state, errors: action.payload };
        case actionTypes.RESET_FORM:
            return { ...initialState };
        default:
            return state;
    }
}

// --- FORM VALIDATION UTILITY ---

const REQUIRED_FIELDS = [
    "combineModel", "engineNo", "fipNo", "doS", "state", "customerName", "dealerName",
];

const validateForm = (formData) => {
    let validationErrors = {};
    REQUIRED_FIELDS.forEach((field) => {
        // Trim and check for emptiness
        if (!formData[field] || String(formData[field]).trim() === "") {
            validationErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required.`;
        }
    });

    // Check if at least one checkpoint is set (optional but professional)
    if (Object.keys(formData.checkpoints).length === 0) {
        // This is a softer check, but ensures the user interacts with the form
        // validationErrors.checkpoints = "Please perform at least one PDI checkpoint.";
    }

    return validationErrors;
};

// --- COMPONENT ---

export default function PdiForm() {
    const [state, dispatch] = useReducer(formReducer, initialState);
    const { loading, popupOpen, note, errors, ...formData } = state;
    const { checkpoints } = formData;

    // A single, robust handler for all standard inputs
    const handleInput = useCallback((e) => {
        const { name, value } = e.target;
        let processedValue = value;

        // Auto-capitalize specific fields for consistency
        if (["engineNo", "chassisNo", "customerName", "dealerName", "state"].includes(name)) {
            processedValue = value.toUpperCase();
        }

        dispatch({ type: actionTypes.HANDLE_INPUT, field: name, value: processedValue });
    }, []);

    // Handler for the radio button checkpoints
    const handleCheck = useCallback((point, value) => {
        dispatch({ type: actionTypes.HANDLE_CHECK, point, value });
    }, []);

    // Function to replace empty/null values with "NaN" for the backend
    const sanitizeData = useCallback((data) => {
        const clean = { ...data };
        Object.keys(clean).forEach((key) => {
            // Check for empty string, null, or undefined
            if (!clean[key] || String(clean[key]).trim() === "") {
                clean[key] = "NaN";
            }
        });
        return clean;
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validation
        const validationErrors = validateForm(formData);
        dispatch({ type: actionTypes.SET_ERRORS, payload: validationErrors });

        if (Object.keys(validationErrors).length > 0) {
            // Scroll to the first error or top of the form for visibility
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 2. Submission Process
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        dispatch({ type: actionTypes.SET_UI_STATE, payload: { note: { message: "", type: "" } } });

        try {
            const cleanData = sanitizeData(formData);
            const res = await registerCombine(cleanData); // API call

            const success = res.success;
            const message = res.data || res.message || (success ? "PDI Sheet submitted successfully." : "Submission failed.");

            dispatch({
                type: actionTypes.SET_UI_STATE,
                payload: {
                    note: { message, type: success ? "SUCCESS" : "ERROR" },
                    popupOpen: true,
                },
            });

            if (success) {
                // Optionally reset the form on success
                // dispatch({ type: actionTypes.RESET_FORM });
            }
        } catch (err) {
            dispatch({
                type: actionTypes.SET_UI_STATE,
                payload: {
                    note: { message: err.message || "An unexpected error occurred.", type: "ERROR" },
                    popupOpen: true,
                },
            });
        } finally {
            dispatch({ type: actionTypes.SET_LOADING, payload: false });
        }
    };

    const handlePrint = () => {
        // Ensures the print function receives the current, potentially unsaved data
        PrintDetails(formData);
    };

    // PDI Check List (using a clearer array structure for professionalism)
    const checkList = [
        "Level of Oil in Engine up to Level", "Air Cleaner Position w.r.t Hoses", "Level of Coolant in Radiator",
        "FIP Connection Check", "Fuel pipes suction, pressure & overflow leaks", "Engine Mounting",
        "Vibration", "Oil leakages", "Fan Belt Tension / Alignment",
        "Hosepipe & clamps tightness", "Paint Quality", "Electrical Connections (Wt meter / RPM / Oil meter)",
        "Turbo drain pipe fitting", "Engine Idling", "Engine Oil & Diesel Filter Tightness",
        "Temperature & Oil Pressure Sensor fitting", "Self starter & alternator fitting",
        "Diesel injectors, nozzle & banjo nut tightness", "EGR Fitting", "Coolant used",
        "Silencer position", "Idle RPM & Full RPM", "Oil Pressure at idle & full load",
        "Water temperature at full load",
    ];

    return (
        <div className="w-full p-6 bg-gray-100 min-h-screen">
            {/* PopUp Modal */}
            {popupOpen && (
                <PopUp
                    data={note.message}
                    type={note.type}
                    isOpen={true}
                    onClose={() => dispatch({ type: actionTypes.SET_UI_STATE, payload: { popupOpen: false } })}
                    title={note.type === "SUCCESS" ? "Submission Successful" : "Error"}
                />
            )}

            <div className="max-w-6xl mx-auto bg-white p-8 shadow-2xl rounded-xl">
                {/* HEADER */}
                <header className="text-center mb-8 border-b pb-4">
                    <h1 className="text-3xl font-extrabold text-blue-800">PREET AGRO INDUSTRIES PVT. LTD.</h1>
                    <p className="text-xl font-bold text-gray-700 mt-2">PDI Sheet (Pre-Delivery Inspection)</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* --- 1. VEHICLE DETAILS --- */}
                    <SectionHeader title="Combine & Customer Details" icon="🚛" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Required Fields */}
                        <InputField label="Combine Model No. *" name="combineModel" value={formData.combineModel} onChange={handleInput} error={errors.combineModel} />
                        <InputField label="Engine No. *" name="engineNo" value={formData.engineNo} onChange={handleInput} error={errors.engineNo} autoCapitalize={true} />
                        <InputField label="Chassis No." name="chassisNo" value={formData.chassisNo} onChange={handleInput} autoCapitalize={true} />
                        <InputField label="FIP Make & Serial No. *" name="fipNo" value={formData.fipNo} onChange={handleInput} error={errors.fipNo} />
                        <InputField label="Date of Sale *" name="doS" value={formData.doS} onChange={handleInput} error={errors.doS} type="date" />
                        <InputField label="Customer Name *" name="customerName" value={formData.customerName} onChange={handleInput} error={errors.customerName} autoCapitalize={true} />
                        <InputField label="Dealer Name *" name="dealerName" value={formData.dealerName} onChange={handleInput} error={errors.dealerName} autoCapitalize={true} />
                        <InputField label="State *" name="state" value={formData.state} onChange={handleInput} error={errors.state} autoCapitalize={true} />
                        
                        {/* Optional/Default Fields */}
                        <InputField label="TREM" name="trem" value={formData.trem} onChange={handleInput} />
                    </div>

                    <hr className="border-gray-300" />

                    {/* --- 2. STATIC SPECIFICATIONS --- */}
                    <SectionHeader title="Component Specifications" icon="⚙️" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                        <StaticDetail label="Air Compressor Make" value="WABCO" />
                        <StaticDetail label="Turbo Charger Make" value="HOLSET" />
                        <StaticDetail label="Radiator Make" value="BANCO" />
                        <StaticDetail label="Alternator Make" value="SEG" />
                        <StaticDetail label="Self-Starter Make" value="SEG" />
                    </div>

                    <hr className="border-gray-300" />

                    {/* --- 3. CHECK POINTS --- */}
                    <SectionHeader title="PDI Check Points" icon="✅" />
                    <div className="space-y-2 border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 font-semibold text-gray-700 pb-3 border-b">
                            <span className="col-span-2">Check Item</span>
                            <span className="text-right hidden md:block">Status</span>
                        </div>
                        {checkList.map((item, i) => (
                            <CheckPointRow
                                key={i}
                                index={i + 1}
                                label={item}
                                status={checkpoints[item]}
                                onCheck={handleCheck}
                            />
                        ))}
                    </div>

                    {/* --- 4. REMARKS --- */}
                    <SectionHeader title="Remarks" icon="📝" />
                    <TextAreaField
                        label="Final Remarks / Deviations"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInput}
                        placeholder="Enter any final comments or notes here..."
                    />

                    {/* --- 5. ACTIONS --- */}
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 rounded-lg font-semibold transition duration-150 ${
                                loading
                                    ? 'bg-blue-400 text-white cursor-wait'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                            }`}
                        >
                            {loading ? "Submitting..." : "💾 Submit PDI Sheet"}
                        </button>
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150 shadow-lg"
                        >
                            🖨️ Print Details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// --- REUSABLE UI COMPONENTS ---

// Wrapper for main sections
function SectionHeader({ title, icon }) {
    return (
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-2 border-b-2 border-blue-500">
            {icon} {title}
        </h2>
    );
}

// Input field with error display
function InputField({ label, name, value, onChange, error, type = "text", autoCapitalize = false }) {
    const isRequired = label.includes('*');
    return (
        <div className="space-y-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                className={`w-full border ${error ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-blue-500'} p-3 rounded-md shadow-sm focus:ring-blue-500`}
                value={value}
                onChange={onChange}
                autoComplete="off"
                required={isRequired}
            />
            {error && <p className="text-red-600 text-xs italic mt-1">{error}</p>}
        </div>
    );
}

// Text area field
function TextAreaField({ label, name, value, onChange, placeholder = "" }) {
    return (
        <div className="space-y-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <textarea
                id={name}
                name={name}
                className="w-full border border-gray-300 focus:border-blue-500 p-3 rounded-md shadow-sm focus:ring-blue-500"
                rows={3}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}

// Static detail display
function StaticDetail({ label, value }) {
    return (
        <div className="flex justify-between border-b border-dashed pb-1">
            <span className="text-sm font-medium text-gray-600">{label}:</span>
            <span className="text-sm font-semibold text-gray-800">{value}</span>
        </div>
    );
}

// Single checkpoint row
function CheckPointRow({ index, label, status, onCheck }) {
    const statuses = ["Ok", "Not Ok", "Rework"];

    const getStatusColor = (s) => {
        if (s === "Ok") return "bg-green-100 border-green-500 text-green-700";
        if (s === "Not Ok") return "bg-red-100 border-red-500 text-red-700";
        if (s === "Rework") return "bg-yellow-100 border-yellow-500 text-yellow-700";
        return "bg-gray-100 border-gray-300 text-gray-500";
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 items-center py-2 border-b last:border-b-0">
            {/* Checkpoint Name */}
            <span className="text-sm font-medium text-gray-800 col-span-2 md:col-span-1">
                {index}. {label}
            </span>

            {/* Radio Buttons */}
            <div className="flex gap-4 justify-start md:col-span-1">
                {statuses.map((s) => (
                    <label key={s} className="flex items-center space-x-1 cursor-pointer">
                        <input
                            type="radio"
                            name={label}
                            checked={status === s}
                            onChange={() => onCheck(label, s)}
                            className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{s}</span>
                    </label>
                ))}
            </div>

            {/* Status Indicator */}
            <div className="hidden md:flex justify-end col-span-1">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(status)}`}>
                    {status || "Pending"}
                </span>
            </div>
        </div>
    );
}