// Import mongoose for schema definition
// Define a userSchema for the "UserData" collection with fields:
// - empCode: Unique, required, trimmed string (employee code)
// - name: Required string, trimmed, with a minimum length of 3 characters
// - email: Case-insensitive string, required, validated with regex for email format
// - password: Required string, with a minimum length of 8 characters
// - admin: Boolean, required to indicate if the user has admin privileges
// - adminKey: String, conditionally required: if the user is an admin, the adminKey must be provided. If not, it can be empty
// Timestamps: Automatically add `createdAt` and `updatedAt` fields
// Create a model using the schema and export it for use in other files



import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    empCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, lowercase: true, match: [/.+\@.+\..+/, "Invalid email format"] },
    password: { type: String, required: true, minlength: 8 },
    admin: { type: Boolean, required: true },
    adminKey: {
        type: String,
        validate: {
            validator: function (value) {
                return !(this.admin && !value); // Admin key required if `admin` is true
            },
            message: "Admin key is required when admin is true",
        }
    }
}, { timestamps: true });

export default mongoose.model("UserData", userSchema);
