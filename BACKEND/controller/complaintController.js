import ComplaintModel from "../models/combineModel.js";

// Function to register attendance (append string data to the array)
export const regAttndence = async (req, res) => {
    try {
        const {engineNo, chassisNo, doS,
            customerName,
            dealerName,
            location,
            state, } = req.body;

        // Validate input fields
        if (!empCode || !engineNo || !Location || !state || !contact || !date) {
            return res.status(400).json({ success: false, message: 'All credentials are required' });
        }

        // Find employee by empCode
        const emp = await ComplaintModel.findOne({ empCode });
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