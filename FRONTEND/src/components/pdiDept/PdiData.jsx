import React, { useReducer, useEffect, useCallback } from "react";
// Assuming you would install: npm install date-fns
import { subWeeks, subMonths, startOfMonth, format, isAfter } from 'date-fns';
import { getCombineDataByDate } from "../helper/combineHelper";

// --- Reducer Setup ---
// Define initial state for useReducer
const initialState = {
    startDate: '',
    endDate: '',
    combineData: [],
    loading: false,
    error: null,
    filterType: "custom", // 'custom' or 'period'
};

// Define actions for the reducer
const actionTypes = {
    SET_DATES: 'SET_DATES',
    SET_FILTER_TYPE: 'SET_FILTER_TYPE',
    FETCH_START: 'FETCH_START',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',
};

// Reducer function to handle state transitions
function dataReducer(state, action) {
    switch (action.type) {
        case actionTypes.SET_DATES:
            return {
                ...state,
                startDate: action.payload.startDate,
                endDate: action.payload.endDate,
                error: null, // Clear error on date change
            };
        case actionTypes.SET_FILTER_TYPE:
            return {
                ...state,
                filterType: action.payload,
            };
        case actionTypes.FETCH_START:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case actionTypes.FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                combineData: action.payload,
                error: null,
            };
        case actionTypes.FETCH_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload,
                combineData: [],
            };
        default:
            return state;
    }
}

// --- Date Calculation Utility ---
/**
 * Calculates start and end dates based on a selected period.
 * Uses date-fns for reliable date logic.
 * @param {string} periodType - 'last-week', 'last-month', 'this-month'
 * @returns {{startDate: string, endDate: string}} Formatted date strings
 */
const calculateDateRange = (periodType) => {
    const now = new Date();
    let startDate;

    switch (periodType) {
        case "last-week":
            startDate = subWeeks(now, 1);
            break;
        case "last-month":
            startDate = subMonths(now, 1);
            break;
        case "this-month":
            startDate = startOfMonth(now);
            break;
        default:
            return { startDate: '', endDate: '' };
    }

    // Format dates to 'YYYY-MM-DD' for input[type="date"]
    return {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(now, 'yyyy-MM-dd'),
    };
};

const CombineDataPage = () => {
    const [state, dispatch] = useReducer(dataReducer, initialState);
    const { startDate, endDate, combineData, loading, error, filterType } = state;

    // Handle Period Dropdown Change
    const handlePeriodChange = (event) => {
        const selectedPeriod = event.target.value;

        dispatch({ type: actionTypes.SET_FILTER_TYPE, payload: selectedPeriod });

        if (selectedPeriod === "custom") {
            // Clear dates when switching back to custom, letting the user set them
            dispatch({ type: actionTypes.SET_DATES, payload: { startDate: '', endDate: '' } });
        } else {
            const { startDate: newStart, endDate: newEnd } = calculateDateRange(selectedPeriod);
            dispatch({ type: actionTypes.SET_DATES, payload: { startDate: newStart, endDate: newEnd } });
            // Since dates are set, we will rely on the useEffect below to trigger fetchData
        }
    };

    // Handle Custom Date Input Change
    const handleDateChange = (dateType, value) => {
        dispatch({
            type: actionTypes.SET_DATES,
            payload: {
                startDate: dateType === 'start' ? value : startDate,
                endDate: dateType === 'end' ? value : endDate,
            },
        });
        // Ensure filter type is set to custom when the user manually changes a date
        dispatch({ type: actionTypes.SET_FILTER_TYPE, payload: "custom" });
    };

    // Fetch combine data from the backend based on selected dates
    const fetchData = useCallback(async () => {
        // Simple validation check
        if (!startDate || !endDate || isAfter(new Date(startDate), new Date(endDate))) {
            dispatch({ type: actionTypes.FETCH_ERROR, payload: "Please select a valid date range (Start date must be before End date)." });
            return;
        }

        dispatch({ type: actionTypes.FETCH_START });

        const result = await getCombineDataByDate(startDate, endDate);

        if (result.success) {
            dispatch({ type: actionTypes.FETCH_SUCCESS, payload: result.data });
        } else {
            dispatch({ type: actionTypes.FETCH_ERROR, payload: result.message || "Failed to fetch data." });
        }
    }, [startDate, endDate]); // Dependencies for useCallback

    // Trigger fetch on date/filter change
    useEffect(() => {
        // Only fetch if we have a valid date range selected (custom or period)
        if (startDate && endDate) {
            fetchData();
        }
    }, [startDate, endDate, fetchData]);


    // Helper function for display logic
    const getCustomerDisplay = (item) => {
        if (item.customerName && item.customerName !== "NaN") return item.customerName;
        if (item.dealerName && item.dealerName !== "NaN") return item.dealerName;
        return "";
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">📊 Combined Data Report</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                    {/* Date Period Dropdown */}
                    <div className="flex flex-shrink-0">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Period:</label>
                        <select
                            onChange={handlePeriodChange}
                            value={filterType}
                            className="w-full md:w-48 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="custom">Custom Date Range</option>
                            <option value="last-week">Last 7 Days</option>
                            <option value="last-month">Last 30 Days</option>
                            <option value="this-month">Current Month</option>
                        </select>
                    </div>

                    {/* Custom Date Range Inputs */}
                    {filterType === "custom" && (
                        <div className="flex flex-col md:flex-row gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date:</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => handleDateChange('start', e.target.value)}
                                    className="border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => handleDateChange('end', e.target.value)}
                                    className="border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}
                     <div className="flex-shrink-0">
                        {/* Button to fetch data (hidden if using period filter and dates are already set) */}
                        <button
                            onClick={fetchData}
                            disabled={loading || !startDate || !endDate}
                            className={`mt-6 md:mt-0 px-6 py-2 rounded-md font-semibold transition duration-150 ${
                                loading || !startDate || !endDate
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                            }`}
                        >
                            {loading ? "Fetching..." : "Run Report"}
                        </button>
                    </div>
                </div>

                {/* Loading/Error Messages */}
                {loading && (
                    <div className="mt-4 flex items-center text-blue-600 font-medium">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading data for **{startDate}** to **{endDate}**...
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md font-medium">
                        Error: {error}
                    </div>
                )}
            </div>

            ---

            {/* Displaying Data in Table */}
            {combineData.length > 0 && (
                <div className="mt-8 bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Results ({combineData.length} Records)</h2>
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Model</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Engine No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Chassis No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">FIP No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Delivery Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Customer/Dealer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {combineData.map((item, index) => (
                                <tr key={item._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">{item.model}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">{item.engineNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">{item.chassisNo && item.chassisNo !== "NaN"? item.chassisNo: ""}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">{item.fipNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                                        {item.doS ? format(new Date(item.doS), 'dd/MM/yyyy') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                                        {getCustomerDisplay(item)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.state && item.state !== "NaN" ? item.state : ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {combineData.length === 0 && !loading && (
                        <div className="text-center p-6 text-gray-500">No data found for the selected period.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CombineDataPage;