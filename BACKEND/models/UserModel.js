import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    empCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, lowercase: true, match: [/.+\@.+\..+/, "Invalid email format"] },
    password: { type: String, required: true, minlength: 8 },
},
    { timestamps: true });

const UserModel = mongoose.model("UserData", userSchema);
export default UserModel;