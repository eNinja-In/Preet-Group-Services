import DailyAttendence from "../models/attenModel.js";

// 1. `regAttndence`: An async function to handle attendance registration requests.
// 2. `req, res`: Express.js request and response objects.
// 3. `empCode, engineNo, contact, Location, state, date, problem`: Destructures incoming attendance data from request body.
// 4. Validation: Checks if all required fields (`empCode`, `engineNo`, `contact`, etc.) are present; returns a 400 error if not.
// 5. Employee Lookup: Finds an employee by `empCode` in the database; returns a 404 error if not found.
// 6. Data Appending: Appends the provided attendance details (e.g., `engineNo`, `Location`) to the employee's respective arrays.
// 7. Save Data: Saves the updated employee document with the new attendance data.
// 8. Response: Returns a success message with the employee's name and ID.
// 9. Error Handling: Catches any errors and returns a 500 error with a relevant message.
export const regAttndence = async (req, res) => {
    try {
        const { empCode, engineNo, contact, Location, state, date, problem } = req.body;
        if (![empCode, engineNo, contact, Location, state, date, problem].every(Boolean)) return res.status(400).json({ success: false, message: 'All fields are required.' });

        const emp = await DailyAttendence.findOne({ empCode });
        if (!emp) return res.status(404).json({ success: false, message: 'Employee not found.' });

        // [engineNo, Location, state, date, problem].forEach((data, index) => emp[Object.keys(emp)[index + 1]].push(data));
        const fieldsToUpdate = ['engineNo', 'contact', 'Location', 'state', 'date', 'problem' ];
        fieldsToUpdate.forEach((field, index) => {
            if (!Array.isArray(emp[field])) {
                emp[field] = [];  // Initialize as an empty array if it's not already an array
            }
            emp[field].push(req.body[Object.keys(req.body)[index + 1]]);  // Push the value to the corresponding array
        });

        await emp.save();
        res.status(200).json({ success: true, message: 'Attendance registered.', employee: { id: emp._id, name: emp.name } });
        console.log(`Employee Attendence Registerd Successfully: EmpCode: ${empCode} ON: ${date} `.green)
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};


// 1. `newAttndence`: Async controller to register a new employee's first attendance entry.
// 2. `req, res`: Express.js request and response objects.
// 3. `empCode, name, engineNo, contact, Location, state, date`: Extracts employee and attendance data from request body.
// 4. Validation: Ensures all required fields are present; returns 400 if any field is missing.
// 5. Duplication Check: Looks for an existing employee with the given `empCode`; returns 409 if found.
// 6. Record Creation: Creates a new attendance document and stores initial values as arrays.
// 7. Saving Data: Saves the new employee attendance document to the database.
// 8. Response: Returns a 201 “created successfully” message with the employee's ID and name.
// 9. Error Handling: Catches unexpected errors and returns a 500 server error response.
export const newAttndence = async (req, res) => {
    try {
        const { empCode, name, engineNo, contact, Location, state, date, problem } = req.body;
        if (![empCode, engineNo, Location, state, contact, date, problem].every(Boolean)) return res.status(400).json({ success: false, message: "All fields are required." });

        if (await DailyAttendence.findOne({ empCode })) return res.status(409).json({ success: false, message: "Employee with this empCode already exists." });

        const newEmployee = await DailyAttendence.create({ empCode, name, contact, engineNo: [engineNo], Location: [Location], state: [state], date: [date], problem: problem });
        res.status(201).json({ success: true, message: "Attendance registered successfully.", employee: { id: newEmployee._id, name: newEmployee.name } });
        console.log(`New Employee Registerd Successfully: EmpCode: ${empCode} `.bgGreen)

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


// 1. `fetchAttendence`: Async controller to fetch an employee's attendance record.
// 2. `req, res`: Express.js request and response objects.
// 3. `empCode`: Extracted from request body to identify the employee.
// 4. Validation: Ensures `empCode` is provided; returns 400 if missing.
// 5. Lookup: Searches database for an employee with the provided `empCode`; returns 404 if not found.
// 6. Data Formatting: Converts array fields (engineNo, Location, state, date) into comma-separated strings.
// 7. Response: Returns formatted attendance data with success message.
// 8. Error Handling: Catches unexpected errors and returns a 500 status.
export const fetchAttendence = async (req, res) => {
    try {
        const { empCode } = req.body;
        if (!empCode) return res.status(400).json({ success: false, message: "empCode is required." });

        const emp = await DailyAttendence.findOne({ empCode });
        if (!emp) return res.status(404).json({ success: false, message: "Employee not found." });

        const data = {
            name: emp.name,
            contact: emp.contact,
            engineNo: emp.engineNo,
            location: emp.Location,
            state: emp.state,
            date: emp.date
        };

        res.status(200).json({ success: true, message: "Attendance data fetched successfully.", data });
        console.log(`Employee Data Fectched Successfully : Employee: ${emp.name} (${empCode})`.green)

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};