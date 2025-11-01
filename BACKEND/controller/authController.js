// Importing required modules and helpers
import UserModel from "../models/UserModel.js";
import { hashPassword, comparePassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";
// import { sendEmail } from "../utils/sendEmail.js"; // Import sendEmail utility

// Text Controller (for protected routing)
export const textController = async (req, res) => {
    res.send("Protected Route");
};

// Login Controller
export const loginController = async (req, res) => {
    try {
        const { empCode, password } = req.body;

        if (!empCode || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const user = await UserModel.findOne({ empCode });
        if (!user) { return res.status(404).json({ success: false, message: "User with this empCode does not exist.", }); }

        // Compare passwords
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) { return res.status(401).json({ success: false, message: "Incorrect password.", }); }

        // Generate JWT token
        const token = JWT.sign({ _id: user._id }, process.env.JSON_SECRET_KEY, { expiresIn: "1h", });

        //         const message = `
        //     User Just Login on the platform!

        //     User Details:
        //     - ID  : ${user._id}
        //     - Name  : ${user.name}
        //     - Email :  ${email}

        //     Please review the new registration.
        //   `;
        //         await sendEmail(message, "User Login Notification");

        res.status(200).json({ success: true, message: "Login successful.", user: { id: user._id, name: user.name }, token, });
    } catch (error) { res.status(500).json({ success: false, message: "Login failed due to server error.", error: error.message, }); }
};

// Register Controller
export const registerController = async (req, res) => {
    try {
        const { empCode, name, email, password } = req.body;

        // Validate input
        if (!empCode || !name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All Credentials are required.",
            });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ empCode });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already registered .",
            });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create and save new user
        const newUser = await new UserModel({
            empCode,
            name,
            email,
            password: hashedPassword,
        }).save();

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
    } catch (error) {
        // await sendEmail("Registration failed due to server error", "Server Error");
        console
        res.status(500).json({
            success: false,
            message: "Registration failed due to server error.",
            error: error.message,
        });
    }
};