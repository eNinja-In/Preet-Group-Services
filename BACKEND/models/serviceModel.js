import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    engineNo: { type: String, required: true, unique: true },
    chassisNo: { type: String, unique: true },
    location: { type: String, trim: true },
    state: { type: String, required: true },
    foreman: {type: list, requiredL: true}

},
    { timestamps: true });


// Create and export the UserModel
const UserModel = mongoose.model("ServiceData", userSchema);
export default UserModel;