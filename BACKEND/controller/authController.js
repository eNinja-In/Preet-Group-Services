import UserModel from "../models/UserModel.js";
import { hashPassword, comparePassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";

// 1. `textController`: An async function that handles HTTP requests to a protected route.
// 2. `req, res`: Standard Express.js request and response objects.
// 3. `res.send()`: Sends a simple text response, "Protected Route", back to the client.
export const textController = async (req, res) => res.send("Protected Route");


// 1. `loginController`: An async function to handle user login requests.
// 2. `req, res`: Express.js request and response objects.
// 3. `empCode, password`: Extracts employee code and password from the request body.
// 4. Validation: Checks if both `empCode` and `password` are provided in the request; returns a 400 status code if not.
// 5. User Lookup: Finds the user with the provided `empCode`. If no user is found, returns a 404 error.
// 6. Password Comparison: Compares the input password with the stored one. If they don't match, returns a 401 error.
// 7. JWT Generation: If login is successful, generates a JWT token with the user's `_id` and a 1-hour expiration.
// 8. Logging: Logs the successful login attempt with the employee's name, empCode, and current timestamp.
// 9. Response: On successful login, returns a 200 status with the user data and JWT token.
// 10. Error Handling: Catches any errors during the process and returns a 500 status with the error message.
export const loginController = async (req, res) => {
    try {
        const { empCode, password } = req.body;
        if (!empCode || !password) return res.status(400).json({ success: false, message: "Email and password required." });

        const user = await UserModel.findOne({ empCode });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password." });

        const token = JWT.sign({ _id: user._id }, process.env.JSON_SECRET_KEY, { expiresIn: "1h" });
        console.log(`Login: ${user.name} (${empCode}) ${new Date().toLocaleString()}`.bgGreen.white);

        res.status(200).json({ success: true, message: "Login successful.", user: { id: user._id, name: user.name }, token });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error.", error: err.message });
    }
};


// 1. `registerController`: Handles the user registration process.
// 2. Input validation: Ensures that all required fields (`empCode`, `name`, `email`, `password`) are provided in the request body.
// 3. Duplicate check: Queries the database to check if a user with the same `empCode` already exists. Returns a `409 Conflict` if a duplicate is found.
// 4. Password hashing: The `password` is hashed using the `hashPassword` utility function to ensure security before storing it in the database.
// 5. User creation: A new `UserModel` document is created and saved with the provided `empCode`, `name`, `email`, and hashed password.
// 6. Success response: Returns a `201 Created` response with a success message upon successful registration.
// 7. Error handling: Catches any server-side errors (e.g., database issues) and responds with a `500 Internal Server Error` and the error message for debugging.
export const registerController = async (req, res) => {
    try {
        const { empCode, name, email, password } = req.body;

        if (!empCode || !name || !email || !password) return res.status(400).json({ success: false, message: "All Credentials are required." });

        const existingUser = await UserModel.findOne({ empCode });
        if (existingUser) return res.status(409).json({ success: false, message: "User already registered." });

        const hashedPassword = await hashPassword(password);

        const newUser = await new UserModel({ empCode, name, email, password: hashedPassword }).save();

        res.status(201).json({ success: true, message: "Registration successful.", user: { id: newUser._id, name: newUser.name, email: newUser.email } });
        console.log(`User: ${name} (${empCode}) Registerd Successifully ${new Date().toLocaleString()} By {}`.bgGreen.white);

    } catch (error) {
        res.status(500).json({ success: false, message: "Registration failed due to server error.", error: error.message });
    }
};


// 1. `adminController`: Handles admin authentication based on adminCode and adminKey.
// 2. Input validation: Ensures that `_id`, `adminCode`, and `adminKey` are provided in the request body.
// 3. User check: Queries the database to find a user by their `_id` and checks if the user has admin privileges.
// 4. Admin check: If the user is not an admin, returns a `404 Not Found` response with a message "YOU ARE NOT ADMIN".
// 5. Password comparison: Compares the provided `adminKey` with the stored adminKey using the `comparePassword` utility function.
// 6. Access denial: If the password doesn't match, returns a `401 Unauthorized` response with "ADMIN ACCESS DENIED".
// 7. Token generation: If the adminKey matches, generates a JWT token for the admin with a 1-hour expiration using `JWT.sign()`.
// 8. Logging: Logs the admin access event to the console for auditing purposes.
// 9. Success response: If authentication is successful, returns a `200 OK` response with a success message and the JWT token.
// 10. Error handling: Catches any server-side errors and returns a `500 Internal Server Error` response with the error message.
export const adminController = async (req, res) => {
    try {
        const { _id, adminCode, adminKey } = req.body;

        if (!_id || !adminCode || !adminKey) return res.status(400).json({ success: false, message: `All Credentials are required. ${adminCode}` });

        const user = await UserModel.findOne({ _id });
        if (!user.admin) return res.status(404).json({ success: false, message: "YOU ARE NOT ADMIN" });

        if (!await comparePassword(adminKey, user.adminKey)) return res.status(401).json({ success: false, message: "ADMIN ACCESS DENIED" });

        const token = JWT.sign({ _id: user._id }, process.env.JSON_SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ success: true, message: "ADMIN ACCESS SUCCESSFUL", admin: { id: user._id, name: user.name }, token });
        console.log(`ADMIN ACCESS : ${user.name} (${user.empCode}) ${new Date().toLocaleString()}`.bgGreen);

    } catch (error) {
        res.status(500).json({ success: false, message: "ACCESS DENIED DUE TO SERVER FAILURE", error: error.message });
    }
};


// 1. `adminregController`: Handles the registration of an admin.
// 2. Input validation: Ensures all required fields (`id`, `empCode`, `adminCode`, `adminKey`) are provided in the request body.
// 3. Admin validation: Queries the database to check if the `id` exists. If the user is not found, it returns a `404 Not Found` error.
// 4. Admin code check: Ensures the `adminCode` matches the one in the environment variable. Returns `400 Bad Request` for incorrect codes.
// 5. Employee check: Searches for an employee using `empCode`. If not found, returns `404 Not Found`.
// 6. Grant admin privileges: The employee is assigned admin privileges, and their `adminKey` is hashed and saved in the database.
// 7. Success response: If the admin assignment is successful, returns a `200 OK` status with the updated user data.
// 8. Error handling: Any errors that occur (e.g., database issues) are caught and returned with a `500 Internal Server Error` status and error message.
export const adminregController = async (req, res) => {
    try {
        const { id, empCode, adminCode, adminKey } = req.body;

        if (!empCode || !id || !adminCode || !adminKey) return res.status(400).json({ success: false, message: "ALL CREDENTIALS ARE REQUIRED." });

        const admin = await UserModel.findOne({ id });
        if (!admin) return res.status(404).json({ success: false, message: 'User not found with the provided ID.' });

        if (adminCode !== process.env.ADMIN_CODE) return res.status(400).json({ success: false, message: 'INCORRECT CREDENTIALS' });

        const newAdmin = await UserModel.findOne({ empCode });
        if (!newAdmin) return res.status(404).json({ success: false, message: 'Employee not found with the provided empCode.' });

        newAdmin.admin = true;
        newAdmin.adminKey = await hashPassword(adminKey);
        await newAdmin.save();

        res.status(200).json({ success: true, message: 'Admin privileges granted successfully.', updatedUser: newAdmin });

    } catch (error) {
        res.status(500).json({ success: false, message: "Registration failed due to server error.", error: error.message });
    }
};