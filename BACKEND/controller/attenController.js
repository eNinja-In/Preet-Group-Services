import DailyAttendence from "../models/attenModel.js";

// Function to register attendance (append string data to the array)
export const regAttndence = async (req, res) => {
    try {
        const { empCode, engineNo, contact, Location, state, date } = req.body;

        // Validate input fields
        if (!empCode || !engineNo || !Location || !state || !contact || !date) {
            return res.status(400).json({ success: false, message: 'All credentials are required' });
        }

        // Find employee by empCode
        const emp = await DailyAttendence.findOne({ empCode });
        if (!emp) {
            return res.status(404).json({ success: false, message: 'Employee not found. Please check the empCode and try again.' });
        }

        // Append the incoming strings to the respective arrays
        emp.engineNo.push(engineNo); // Append engineNo (string) to the array
        emp.Location.push(Location); // Append Location (string) to the array
        emp.state.push(state); // Append state (string) to the array
        emp.date.push(date); // Append date (string) to the array

        // Save updated employee attendance record
        await emp.save();

        // Respond with success message
        res.status(200).json({
            success: true,
            message: "Attendance registered successfully.",
            employee: { id: emp._id, name: emp.name }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error occurred while registering attendance." });
    }
};

// Function to register new attendance (create new record)
export const newAttndence = async (req, res) => {
    try {
        const { empCode, name, engineNo, contact, Location, state, date } = req.body;

        // Validate input fields
        if (!empCode || !engineNo || !Location || !state || !contact || !date) {
            return res.status(400).json({ success: false, message: 'All credentials are required' });
        }

        // Check if the employee already exists
        const existingEmployee = await DailyAttendence.findOne({ empCode });
        if (existingEmployee) {
            return res.status(409).json({ success: false, message: "An employee with this empCode already exists." });
        }

        // Create new employee attendance record
        const newEmployee = new DailyAttendence({
            empCode,
            name,
            engineNo: [engineNo],  // Initializing as an array with one string
            contact,
            Location: [Location],  // Initializing as an array with one string
            state: [state],  // Initializing as an array with one string
            date: [date]  // Initializing as an array with one string
        });

        // Save new employee attendance record
        await newEmployee.save();

        // Respond with success message
        res.status(201).json({
            success: true,
            message: "Attendance registered successfully.",
            employee: { id: newEmployee._id, name: newEmployee.name }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error occurred while registering new attendance." });
    }
};

export const fetchAttendence = async (req, res) => {
    try {
        const { empCode } = req.body; // Extract empCode from the request body

        // Validate that empCode is provided
        if (!empCode) {
            return res.status(400).json({
                success: false,
                message: "Employee code (empCode) is required",
            });
        }

        // Find the employee by empCode
        const emp = await DailyAttendence.findOne({ empCode });

        // Check if the employee exists
        if (!emp) {
            return res.status(404).json({
                success: false,
                message: "Employee not found. Please check the empCode.",
            });
        }

        // Prepare the attendance data for the response
        const fetchedData = {
            name: emp.name,
            contact: emp.contact,
            engineNo: emp.engineNo.join(", "), // Joining array values into a string
            location: emp.Location.join(", "), // Joining array values into a string
            state: emp.state.join(", "), // Joining array values into a string
            date: emp.date.join(", "), // Joining array values into a string
        };

        // Respond with the attendance data
        res.status(200).json({
            success: true,
            message: "Attendance data fetched successfully.",
            data: fetchedData,
        });

    } catch (error) {
        console.error("Error fetching attendance data:", error);
        res.status(500).json({
            success: false,
            message: "Server error occurred while fetching attendance data.",
        });
    }
};