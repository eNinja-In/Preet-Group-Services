import UserModel from "../models/UserModel.js";
import { hashPassword, comparePassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";

// Text Controller (for protected routing)
export const textController = async (req, res) => {
    res.send("Protected Route");
};

// USER Login Controller
export const loginController = async (req, res) => {
    try {
        const { empCode, password } = req.body;

        if (!empCode || !password) { return res.status(400).json({ success: false, message: "Email and password are required.", }); }

        const user = await UserModel.findOne({ empCode });
        if (!user) { return res.status(404).json({ success: false, message: "User with this empCode does not exist.", }); }

        // Compare passwords
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) { return res.status(401).json({ success: false, message: "Incorrect password.", }); }

        // Generate JWT token
        const token = JWT.sign({ _id: user._id }, process.env.JSON_SECRET_KEY, { expiresIn: "1h", });

        console.log(`Login Employee: ${user.name} (${empCode}) ${new Date().toLocaleString()}`);

        res.status(200).json({ success: true, message: "Login successful.", user: { id: user._id, name: user.name }, token, });

    } catch (error) { res.status(500).json({ success: false, message: "Login failed due to server error.", error: error.message, }); }
};

// USER Register Controller
export const registerController = async (req, res) => {
    try {
        const { empCode, name, email, password } = req.body;

        // Validate input
        if (!empCode || !name || !email || !password) { return res.status(400).json({ success: false, message: "All Credentials are required.", }); }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ empCode });
        if (existingUser) { return res.status(409).json({ success: false, message: "User already registered .", }); }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create and save new user
        const newUser = await new UserModel({ empCode, name, email, password: hashedPassword, }).save();

    } catch (error) { res.status(500).json({ success: false, message: "Registration failed due to server error.", error: error.message, }); }
};

// ADMIN LOGIN Controller
export const adminController = async (req, res) => {
    try {
        const { _id, adminCode, adminKey } = req.body;

        if (!_id || !adminCode || !adminKey) { return res.status(400).json({ success: false, message: `All Credentials are required. ${ adminCode, adminKey }`}); }

        const user = await UserModel.findOne({ _id });
        if (!user.admin) { return res.status(404).json({ success: false, message: "YOU ARE NOT ADMIN", }); }

        // Compare passwords
        const isMatch = await comparePassword(adminKey, user.adminKey);
        if (!isMatch) { return res.status(401).json({ success: false, message: "ADMIN ACCESS DENIED", }); }

        // Generate JWT token
        const token = JWT.sign({ _id: user._id }, process.env.JSON_SECRET_KEY, { expiresIn: "1h", });

        console.log(`ADMIN ACCESS : ${user.name} (${user.empCode}) ${new Date().toLocaleString()}`);

        res.status(200).json({ success: true, message: "ADMIN ACCESS SUCCESSFULLY", admin: { id: user._id, name: user.name }, token, });

    } catch (error) { res.status(500).json({ success: false, message: "ACCESS DENIED DUE TO SERVER FAILURE", error: error.message, }); }
};

// ADD ADMIN Controller
export const adminregController = async (req, res) => {
    try {
        const { id, empCode, adminCode, adminKey } = req.body;

        // Validate input
        if (!empCode || !id || !adminCode || !adminKey) { return res.status(400).json({ success: false, message: "All Credentials are required.".toUpperCase(), }); }

        // Check if user already exists
        const admin = await UserModel.findOne({ id });
        if (!admin) { return res.status(404).json({ success: false, message: 'User not found with the provided ID.', }); }

        if (adminCode != process.env.ADMIN_CODE) { return res.status(400).json({ success: false, message: 'INCORRECT CREDENTIALS' }) }

        const newAdmin = await UserModel.findOne({ empCode });
        if (!newAdmin) { return res.status(404).json({ success: false, message: 'Employee with provided empCode not found.', }); }

        const hashedAdminKey = await hashPassword(adminKey);

        newAdmin.admin = true;
        newAdmin.adminKey = hashedAdminKey;

        await newAdmin.save();

        return res.status(200).json({ success: true, message: 'Admin privileges granted successfully.', updatedUser: newAdmin, });

    } catch (error) { res.status(500).json({ success: false, message: "Registration failed due to server error.", error: error.message, }); }
};






//     // Email content
//     const message = `
//     A new user has registered on the platform!

//     User Details:
//     - Name: ${name}
//     - Email: ${email}

//     Please review the new registration.
//   `;
//     const subject = "New User Registration Notification";

// Send welcome email
// try {
//   await sendEmail(message, subject);
//   res.status(201).json({
//     success: true,
//     message: "User registered successfully",
//     user: { id: newUser._id, name: newUser.name },
//   });
// } catch (emailError) {
// //   await sendEmail(
// //     "User is registered but no confirmation email",
// //     "Email Error"
// //   );
//   res.status(201).json({
//     success: true,
//     message: "User registered",
//     user: { id: newUser._id, name: newUser.name },
//     error: emailError.message,
//   });
// }