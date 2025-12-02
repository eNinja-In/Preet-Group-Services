import React, { useReducer, useEffect, useState, useCallback } from "react";
import { subWeeks, subMonths, startOfMonth, format } from "date-fns";

// Initial dispatch data structure (kept for reference, not directly used in initial state)
// const initialDispatchData = {
//   dispatchDate: "",
//   empCode: "",
//   empName: "",
//   contact: "",
//   materials: [
//     { name: "Item A", quantity: 10, price: 50, total: 500 },
//     { name: "Item B", quantity: 5, price: 30, total: 150 },
//   ],
// };

const initialState = {
    // Removed startDate and endDate from state as requested
    empCode: "",
    empName: "",
    dispatchData: [], // Stores all dispatch data
    loading: false,
    error: null,
    filterType: "all", // Default to 'All'
};

const actionTypes = {
    SET_FILTER_TYPE: "SET_FILTER_TYPE",
    SET_EMP_CODE: "SET_EMP_CODE",
    SET_EMP_NAME: "SET_EMP_NAME",
    FETCH_START: "FETCH_START",
    FETCH_SUCCESS: "FETCH_SUCCESS",
    FETCH_ERROR: "FETCH_ERROR",
};

function dispatchDataReducer(state, action) {
    switch (action.type) {
        case actionTypes.SET_FILTER_TYPE:
            return { ...state, filterType: action.payload, error: null };
        case actionTypes.SET_EMP_CODE:
            return { ...state, empCode: action.payload };
        case actionTypes.SET_EMP_NAME:
            return { ...state, empName: action.payload };
        case actionTypes.FETCH_START:
            return { ...state, loading: true, error: null };
        case actionTypes.FETCH_SUCCESS:
            return { ...state, loading: false, dispatchData: action.payload, error: null };
        case actionTypes.FETCH_ERROR:
            return { ...state, loading: false, error: action.payload, dispatchData: [] };
        default:
            return state;
    }
}

// Generate random dispatch data (slightly enhanced for different dates and materials)
const generateRandomDispatchData = () => {
    const today = new Date();
    const materialList = ["Item A", "Item B", "Item C", "Item D", "Item E"];
    const prices = { "Item A": 50, "Item B": 30, "Item C": 75, "Item D": 40, "Item E": 60 };

    const employees = [
        { empCode: "E001", empName: "John Doe", contact: "123-456-7890" },
        { empCode: "E002", empName: "Jane Smith", contact: "123-456-7891" },
        { empCode: "E003", empName: "Alice Johnson", contact: "123-456-7892" },
        { empCode: "E004", empName: "Bob Brown", contact: "123-456-7893" },
        { empCode: "E005", empName: "Charlie Davis", contact: "123-456-7894" },
    ];

    const allDispatchEntries = [];

    // Generate entries for the last 30 days
    for (let i = 0; i < 30; i++) {
        const dispatchDate = subMonths(today, 0, { weeks: i / 7, days: i % 7 });
        const formattedDate = format(dispatchDate, "yyyy-MM-dd");

        employees.forEach(emp => {
            if (Math.random() > 0.3) { // 70% chance of a dispatch on any given day
                const materials = [];
                const numMaterials = Math.floor(Math.random() * 3) + 1; // 1 to 3 materials

                for (let j = 0; j < numMaterials; j++) {
                    const materialName = materialList[Math.floor(Math.random() * materialList.length)];
                    const quantity = Math.floor(Math.random() * 10) + 1;
                    const price = prices[materialName];
                    const total = quantity * price;

                    materials.push({ name: materialName, quantity, price, total });
                }

                if (materials.length > 0) {
                    allDispatchEntries.push({
                        ...emp,
                        dispatchDate: formattedDate,
                        materials,
                    });
                }
            }
        });
    }

    return allDispatchEntries;
};

// Date range calculation based on period type
const calculateDateRange = (periodType) => {
    const now = new Date();
    let startDate;
    let endDate = now;

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
        case "all":
            // For "all", we assume a very old start date or handle it within fetchData
            return { startDate: "1900-01-01", endDate: format(now, "yyyy-MM-dd") };
        default:
            return { startDate: "", endDate: "" };
    }

    return { startDate: format(startDate, "yyyy-MM-dd"), endDate: format(endDate, "yyyy-MM-dd") };
};

const DispatchReports = () => {
    const [state, dispatch] = useReducer(dispatchDataReducer, initialState);
    const { empCode, empName, dispatchData, loading, error, filterType } = state;
    const [expandedEmp, setExpandedEmp] = useState(null); // State for the expanded employee row

    // Calculate the date range based on the filterType (needed for fetchData and display)
    const { startDate, endDate } = calculateDateRange(filterType);

    // Handle Period Dropdown Change
    const handlePeriodChange = (event) => {
        const selectedPeriod = event.target.value;
        dispatch({ type: actionTypes.SET_FILTER_TYPE, payload: selectedPeriod });
    };

    // Handle search by EmpCode
    const handleEmpCodeChange = (event) => {
        dispatch({ type: actionTypes.SET_EMP_CODE, payload: event.target.value });
    };

    // Handle search by EmpName
    const handleEmpNameChange = (event) => {
        dispatch({ type: actionTypes.SET_EMP_NAME, payload: event.target.value });
    };

    // Toggle expanded employee details
    const toggleExpand = (empCode) => {
        setExpandedEmp(expandedEmp === empCode ? null : empCode);
    };

    // Fetch dispatch data (simulated with random data and filtering)
    const fetchData = useCallback(async () => {
        dispatch({ type: actionTypes.FETCH_START });
        try {
            // Get all simulated data
            const allData = generateRandomDispatchData();

            // Step 1: Filter by Date Range (unless filterType is 'all')
            const dateFilteredData = allData.filter((item) => {
                if (filterType === "all") return true; // Include all dates for 'all'

                const itemDate = new Date(item.dispatchDate);
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // Include the whole end date

                return itemDate >= start && itemDate <= end;
            });

            // Step 2: Filter by empCode or empName
            const searchFilteredData = dateFilteredData.filter((item) => {
                const isEmpCodeMatch = empCode ? item.empCode.toLowerCase().includes(empCode.toLowerCase()) : true;
                const isEmpNameMatch = empName ? item.empName.toLowerCase().includes(empName.toLowerCase()) : true;
                return isEmpCodeMatch && isEmpNameMatch;
            });

            // Step 3: Group data by Employee for the main report table
            const groupedData = searchFilteredData.reduce((acc, current) => {
                const existing = acc.find(item => item.empCode === current.empCode);
                if (existing) {
                    // Merge materials and dispatch entries
                    existing.allMaterials.push(...current.materials.map(m => ({ ...m, dispatchDate: current.dispatchDate })));
                } else {
                    acc.push({
                        empCode: current.empCode,
                        empName: current.empName,
                        contact: current.contact,
                        // Store all individual dispatch entries for expansion
                        allMaterials: current.materials.map(m => ({ ...m, dispatchDate: current.dispatchDate })),
                    });
                }
                return acc;
            }, []);

            dispatch({ type: actionTypes.FETCH_SUCCESS, payload: groupedData });
        } catch (e) {
            dispatch({ type: actionTypes.FETCH_ERROR, payload: "Error fetching data" });
        }
    }, [filterType, empCode, empName, startDate, endDate]);

    // Re-fetch data whenever filter or search changes
    useEffect(() => {
        fetchData();
    }, [filterType, empCode, empName, fetchData]);

    // Calculate totals for the main table row
    const calculateTotals = (materials) => {
        const totalDispatched = materials.reduce((acc, item) => acc + item.quantity, 0);
        const totalBill = materials.reduce((acc, item) => acc + item.total, 0);

        // Assuming "Items Returned" is a conceptual field for now.
        // For simplicity, we'll set it to a random percentage of dispatched items for the simulation.
        // In a real application, this would come from the backend.
        const itemsReturned = Math.floor(totalDispatched * (Math.random() * 0.4)); // 0% to 40% returned

        const pendingBillAmount = totalBill; // In this simplified simulation, the entire bill is 'pending'

        return { totalDispatched, itemsReturned, totalBill, pendingBillAmount };
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">📊 Dispatch Report</h1>

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    {/* Period Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Period:</label>
                        <select
                            onChange={handlePeriodChange}
                            value={filterType}
                            className="w-full md:w-48 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Time</option>
                            <option value="last-week">Last 7 Days</option>
                            <option value="last-month">Last 30 Days</option>
                            <option value="this-month">Current Month</option>
                        </select>
                    </div>

                    {/* Search Inputs */}
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search by Emp Code"
                            value={empCode}
                            onChange={handleEmpCodeChange}
                            className="border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Search by Emp Name"
                            value={empName}
                            onChange={handleEmpNameChange}
                            className="border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Loading/Error Messages */}
                {loading && (
                    <div className="mt-4 flex items-center text-blue-600 font-medium">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading data...
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md font-medium">
                        Error: {error}
                    </div>
                )}
            </div>

            {/* Table for Displaying Data */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th> {/* For Expand Icon */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emp Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Dispatched</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Returned</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bill</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dispatchData.map((item, index) => {
                                const { totalDispatched, itemsReturned, totalBill, pendingBillAmount } = calculateTotals(item.allMaterials);
                                const isExpanded = expandedEmp === item.empCode;

                                // Calculate materials detail (materials dispatched per date)
                                const detailsByDate = item.allMaterials.reduce((acc, material) => {
                                    const date = material.dispatchDate;
                                    if (!acc[date]) {
                                        acc[date] = [];
                                    }
                                    acc[date].push(material);
                                    return acc;
                                }, {});

                                return (
                                    <React.Fragment key={item.empCode}>
                                        {/* Main Row */}
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <button onClick={() => toggleExpand(item.empCode)} className="text-blue-500 hover:text-blue-700 focus:outline-none">
                                                    <svg className={`w-4 h-4 transform ${isExpanded ? 'rotate-90' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-semibold">{item.empCode}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.empName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{totalDispatched}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{itemsReturned}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">₹{totalBill.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {totalBill === 0 ? (
                                                    <span className="text-gray-500 font-medium">None</span>
                                                ) : (
                                                    <span className="text-red-600 font-bold">Pending: ₹{pendingBillAmount.toFixed(2)}</span>
                                                )}
                                            </td>
                                        </tr>

                                        {/* Expanded Detail Row */}
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan="8" className="p-4 bg-blue-50/70 border-b border-blue-200">
                                                    <h4 className="text-lg font-semibold text-blue-800 mb-2">Dispatch Details for {item.empName} ({item.empCode})</h4>

                                                    {Object.entries(detailsByDate).map(([date, materials]) => (
                                                        <div key={date} className="mb-4 p-3 bg-blue-100 rounded-lg">
                                                            <h5 className="font-bold text-blue-700 mb-1">Dispatch Date: {date}</h5>
                                                            <ul className="list-disc list-inside space-y-1 text-sm flex flex-wrap gap-2 justify-center">
                                                                {materials.map((material, matIndex) => (
                                                                    <li key={matIndex} className="text-gray-800 list-none p-2 w-9/20 border">
                                                                        {material.name}:-&gt; {material.quantity} units :-&gt; ₹{material.price.toFixed(1)} / item  ==&gt; (Total: ₹{material.total.toFixed(1)})
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {!loading && dispatchData.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No dispatch data found for the current filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DispatchReports;