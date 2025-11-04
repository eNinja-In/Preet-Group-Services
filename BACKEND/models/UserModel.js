import mongoose from "mongoose";
import { type } from "node:os";

const userSchema = new mongoose.Schema({
    empCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, lowercase: true, match: [/.+\@.+\..+/, "Invalid email format"] },
    password: { type: String, required: true, minlength: 8 },
    admin: { type: Boolean, required: true },
    adminKey: {
        type: String, validate: {
            validator: function (value) {
                // If `admin` is true, `adminKey` is required
                if (this.admin && !value) {
                    return false; // Validation fails if adminKey is empty
                }
                return true; // Validation passes if adminKey is provided or admin is false
            },
            message: "Admin key is required when admin is true",
        },
    }
},
    { timestamps: true });

const UserModel = mongoose.model("UserData", userSchema);
export default UserModel;